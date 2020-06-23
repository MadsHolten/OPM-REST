const m = require('./methods');
const path = require('path');
const uploadsFolder = path.join(__dirname, '../../../../static/uploads');
const tempUploadFolder = path.join(uploadsFolder, '/temp');
const multer = require('multer');
const util = require('util');
const fs = require('fs');
const urljoin = require('url-join');
const uuidv4 = require('uuid/v4');

const deleteFile = util.promisify(fs.unlink);
const writeFile = util.promisify(fs.writeFile);

var upload = multer({
    dest: tempUploadFolder
}).single('file')

// GLOBAL VARIABLES
var projectNumber;
var tempGraphURI;
var dsURI;

module.exports = (app) => {

    // DESCRIBE RESOURCE
    app.post('/:projNo/opm-upload/class-create', async (req, res, next) => {

        process.env.DEBUG && console.log(`Route: POST /${req.params.projNo}/opm-upload/class-create`);

        // Get data
        projectNumber = req.params.projNo;

        // A data source URI (dsURI) is optional, but required for deletion (and general insights)
        // When recieving new class creation, a check to the existing classes from the same data source will be made
        // Any existing class which belongs to the same dsURI and which is not found in the new
        // batch will be marked as opm:Deleted
        dsURI = req.query.dsURI;

        // Make URI for temp graph
        tempGraphURI = urljoin(process.env.DATA_NAMESPACE, projectNumber, 'class-create-temp');

        // Get content type header
        const contentType = req.headers['content-type'];
        if(!contentType || contentType == undefined) return next({msg: "Please specify a content-type header", status: 400});

        // Set content-type of response
        res.type('text/plain')

        // Handle text
        if(contentType.indexOf('multipart/form-data') == -1){

            process.env.DEBUG && console.log(`Handling text/turtle body...`);

            const triples = req.body;

            // Throw error if no data recieved
            if(!triples) return next({msg: "No triples recieved", status: 400})

            const fileName = uuidv4().toString();
            const tempFilePath = path.join(tempUploadFolder, fileName)

            // Write triples to a file
            try{
                await writeFile(tempFilePath, triples)
            }catch(e){
                console.log(e)
                return next({msg: e, status: 500})
            }
            
            // Do all the OPM stuff
            try{
                const msg = await _opmMain(projectNumber, tempFilePath, tempGraphURI);
                process.env.DEBUG && console.log('  - '+msg+'\n');
                res.send(msg);
            }catch(e){
                return next({msg: e.message, status: e.status})
            }
        }

        // Handle file
        else{

            process.env.DEBUG && console.log(`Handling file...`);

            // Get file content and load it in temp graph
            upload(req, res, async (err) => {

                // Throw error if no file recieved
                if(!req.file) return next({msg: "No file recieved", status: 400})

                // Throw error if upload fails
                if(err) return next({msg: "File upload failed", status: 422})

                // Get temp file path
                var tempFilePath = path.join(tempUploadFolder, req.file.filename)

                // Do all the OPM stuff
                try{
                    const msg = await _opmMain(projectNumber, tempFilePath, tempGraphURI);
                    process.env.DEBUG && console.log('  - '+msg+'\n');
                    res.send(msg);
                }catch(e){
                    return next({msg: e.message, status: e.status})
                }

            })
        }

    })

}

const _opmMain = async (projectNumber, tempFilePath, tempGraphURI) => {

    var msg;

    // Upload file to temp graph in triplestore
    await global.helpers.triplestoreConnection.loadFile(projectNumber, tempFilePath, tempGraphURI)

    // Delete temp file (returns promise)
    var deleteTempPromise = deleteFile(tempFilePath)

    // Count number of new classes that will be created
    let newClasses = await _getNew();
    let countNew = newClasses.length;

    // Insert new class assignments if such exist
    if(countNew !== 0) await _writeNewClasses();

    // Count number of deleted classes that should be marked as opm:Deleted and append the opm:Deleted class
    // This is only possible if a dsURI is provided
    let deletedClasses = [];
    let countDeleted = 0;
    if(dsURI){
        deletedClasses = await _getDeleted();
        
        countDeleted = deletedClasses.length;

        // Mark deleted classes
        if(countDeleted !== 0) await m.markDeleted(projectNumber, deletedClasses);
    }

    // Count number of previously deleted classes that are now back and remove the opm:Deleted class
    // This is only possible if a dsURI is provided
    let restoredClasses = [];
    let countRestored = 0;
    if(dsURI){
        restoredClasses = await _getRestored();
        
        countRestored = restoredClasses.length;

        // Remove opm:Deleted class
        if(countRestored !== 0) await m.unMarkDeleted(projectNumber, restoredClasses);
    }

    // Update result message
    if(countNew == 0 && countDeleted == 0 && countRestored == 0){
        msg = `All classes already exist in the main graph and nothing was deleted or restored.`;
    }else{
        msg = `Added ${countNew} new classes`;
        if(countDeleted) msg += `\nDeleted ${countDeleted} classes that were missing in the batch`;
        if(countRestored) msg += `\nRestored ${countRestored} classes that were previously missing in the batch but are now back`;
    }

    if(dsURI){
        msg = "***OPM-REST SYNC LOG***\nSuccessfully performed class-create task.\n\n"+msg;
        let affectedURIs = deletedClasses.concat(restoredClasses);
        affectedURIs = affectedURIs.concat(newClasses);
        await m.writeLog(projectNumber, msg, dsURI, affectedURIs);
    }

    // Make sure temp file was deleted
    await deleteTempPromise;

    await m.clearTempGraph(projectNumber, tempGraphURI);

    return msg;

}

const _getNew = async () => {
    // Query to count the number of new classes that will be created
    var q = `
    PREFIX owl: <http://www.w3.org/2002/07/owl#>
    SELECT ?s
    WHERE {
        # GET NEW CLASSES FROM TEMP GRAPH
        GRAPH <${tempGraphURI}> {
            ?s a owl:Class
        }
        # MUST NOT ALREADY EXIST IN MAIN GRAPH
        MINUS {
            ?s a owl:Class
        }
    }`;

    var x = await global.helpers.triplestoreConnection.getQuery(projectNumber, q);

    if(x.results.bindings.length){
        return x.results.bindings.map(item => item.s.value);
    }else{
        return [];
    }

}

const _getDeleted = async () => {
    // Query to count the number of classes that will be marked as deleted
    var q = `
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX opm: <https://w3id.org/opm#>
        SELECT DISTINCT ?s
        WHERE {
            # GET EXISTING CLASS ASSIGNMENTS OF THINGS WITH MATCHING DATA SOURCES
            ?s a owl:Class ;
                opm:dataSource <${dsURI}> .
            
            # Must not be classified as deleted already
            MINUS{ ?s a opm:Deleted }

            # MUST NOT EXIST IN TEMP GRAPH
            FILTER NOT EXISTS {
                GRAPH <${tempGraphURI}> {
                    ?s a owl:Class
                }
            }
        }`;

    var x = await global.helpers.triplestoreConnection.getQuery(projectNumber, q);
    const URIs = x.results.bindings.map(item => item.s.value);

    return URIs;
}

const _getRestored = async () => {
    // Query to count the number of classes that will be marked as deleted

    var q = `
        PREFIX opm: <https://w3id.org/opm#>
        SELECT DISTINCT ?s
        WHERE {
            # MUST EXIST IN TEMP GRAPH
            GRAPH <${tempGraphURI}> {
                ?s a owl:Class
            }

            #  BELONG TO SAME DATA SOURCE
            ?s a opm:Deleted ;
                opm:dataSource <${dsURI}> .
        }`;

    var x = await global.helpers.triplestoreConnection.getQuery(projectNumber, q);
    const URIs = x.results.bindings.map(item => item.s.value);

    return URIs;
}

// Put all new classes and their static properties (revit ID, GUID etc.) 
// in the main graph with a new time stamp assigned
const _writeNewClasses = async () => {

    let ds = dsURI ? `opm:dataSource <${dsURI}> ;` : "";

    q = `
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX prov: <http://www.w3.org/ns/prov#>
        PREFIX opm: <https://w3id.org/opm#>
        INSERT {
            ?s a owl:Class ;
                ?key ?val ;
                ${ds}
                prov:generatedAtTime ?now
        }
        WHERE {
            # GET NEW CLASS ASSIGNMENTS FROM TEMP GRAPH
            GRAPH <${tempGraphURI}> {
                ?s a owl:Class ;
                    ?key ?val .
            }
            # MUST NOT ALREADY EXIST IN MAIN GRAPH
            MINUS {
                ?s a owl:Class
            }
            BIND(NOW() as ?now)
        }`;

    return global.helpers.triplestoreConnection.updateQuery(projectNumber,q);
}

const _restoreClasses = async (URIs) => {

    // Rewrite list of URIs to SPARQL values format
    URIs = URIs.map(URI => `<${URI}>`).join(' ');

    var q = `
        PREFIX opm: <https://w3id.org/opm#>
        PREFIX prov: <http://www.w3.org/ns/prov#>
        DELETE{
            ?s a opm:Deleted ;
                prov:invalidatedAtTime ?t
        }
        WHERE {
            VALUES ?s { ${URIs} }
            ?s a opm:Deleted ;
                prov:invalidatedAtTime ?t .
        }`;

    return global.helpers.triplestoreConnection.updateQuery(projectNumber,q);

}