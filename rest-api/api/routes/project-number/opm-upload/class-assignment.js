
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
}).single('file');

// GLOBAL VARIABLES
var projectNumber;
var tempGraphURI;
var dsURI;

module.exports = (app) => {

    // DESCRIBE RESOURCE
    app.post('/:projNo/opm-upload/class-assignment', async (req, res, next) => {

        process.env.DEBUG && console.log(`Route: POST /${req.params.projNo}/opm-upload/class-assignment`);

        // Get project number and set global variable
        projectNumber = req.params.projNo;

        // A data source URI (dsURI) is optional, but required for deletion (and general insights)
        // When recieving new class assignment, a check to the existing instances will be made.
        // Any existing instance which belongs to this dsURI and which is not found in the new
        // batch will be marked as opm:Deleted
        dsURI = req.query.dsURI;

        // Make URI for temp graph
        tempGraphURI = urljoin(process.env.DATA_NAMESPACE, projectNumber, 'class-ass-temp');

        // Get content type header
        const contentType = req.headers['content-type'];
        if(!contentType || contentType == undefined) return next({msg: "Please specify a content-type header", status: 400});

        // Set content-type of response
        res.type('text/plain');

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
            
            // // Do all the OPM stuff
            try{
                const msg = await _opmMain(tempFilePath);
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
                const tempFilePath = path.join(tempUploadFolder, req.file.filename)

                // // Do all the OPM stuff
                try{
                    const msg = await _opmMain(tempFilePath, tempGraphURI);
                    process.env.DEBUG && console.log('  - '+msg+'\n');
                    res.send(msg);
                }catch(e){
                    return next({msg: e.message, status: e.status})
                }

            });

        }

    })

}

const _opmMain = async (tempFilePath) => {

    var msg;

    // Upload file to temp graph in triplestore
    await global.helpers.triplestoreConnection.loadFile(projectNumber, tempFilePath, tempGraphURI)

    // Delete temp file (returns promise)
    var deleteTempPromise = deleteFile(tempFilePath)

    // Count number of new class assignments that will be created
    let newInstances = await _getNew();
    let countNew = newInstances.length;

    // Insert new class assignments if such exist
    if(countNew !== 0) await _writeNewClassAssignments();

    // Count number of deleted instances that should be marked as opm:Deleted and append the opm:Deleted class
    // This is only possible if a dsURI is provided
    let deletedInstances = [];
    let countDeleted = 0;
    if(dsURI){
        deletedInstances = await _getDeleted();
        
        countDeleted = deletedInstances.length;

        // Mark deleted classes
        if(countDeleted !== 0) await m.markDeleted(projectNumber, deletedInstances);
    }

    // Count number of previously deleted instances that are now back and remove the opm:Deleted class
    // This is only possible if a dsURI is provided
    let restoredInstances = [];
    let countRestored = 0;
    if(dsURI){
        restoredInstances = await _getRestored();
        
        countRestored = restoredInstances.length;

        // Remove opm:Deleted class
        if(countRestored !== 0) await m.unMarkDeleted(projectNumber, restoredInstances);
    }

    // Update result message
    if(countNew == 0 && countDeleted == 0 && countRestored == 0){
        msg = `All class assignments already exist in the main graph and nothing was deleted or restored.`;
    }else{
        msg = `Assigned ${countNew} instance(s) to a class`;
        if(countDeleted) msg += `\nDeleted ${countDeleted} instance(s) that were missing in the batch`;
        if(countRestored) msg += `\nRestored ${countRestored} instance(s) that were previously missing in the batch but are now back`;
    }

    if(dsURI){
        msg = "***OPM-REST SYNC LOG***\nSuccessfully performed class-assignment task.\n\n"+msg;
        let affectedURIs = deletedInstances.concat(restoredInstances);
        affectedURIs = affectedURIs.concat(newInstances);
        await m.writeLog(projectNumber, msg, dsURI, affectedURIs);
    }

    await m.clearTempGraph(projectNumber, tempGraphURI);

    // Make sure temp file was deleted
    await deleteTempPromise;

    return msg;

}

const _getNew = async () => {
    // Query to count the number of new class instances that will be created
    var q = `
        SELECT DISTINCT ?s
        WHERE {
            # GET NEW CLASS ASSIGNMENTS FROM TEMP GRAPH
            GRAPH <${tempGraphURI}> {
                ?s a ?class
            }
            # MUST NOT ALREADY EXIST IN MAIN GRAPH
            MINUS {
                ?s a ?class
            }
        }`;
    const x = await global.helpers.triplestoreConnection.getQuery(projectNumber, q);

    if(x.results.bindings.length){
        return x.results.bindings.map(item => item.s.value);
    }else{
        return [];
    }
}

const _getDeleted = async () => {
    // Query to count the number of classes that will be marked as deleted

    var q = `
        PREFIX opm: <https://w3id.org/opm#>
        SELECT DISTINCT ?s
        WHERE {
            # GET EXISTING CLASS ASSIGNMENTS OF THINGS WITH MATCHING DATA SOURCES
            ?s a ?class ;
                opm:dataSource <${dsURI}> .
            
            # Must not be classified as deleted already
            MINUS{ ?s a opm:Deleted }

            # MUST NOT EXIST IN TEMP GRAPH
            FILTER NOT EXISTS {
                GRAPH <${tempGraphURI}> {
                    ?s a ?class
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
                ?s a ?class
            }

            # MUST BE DELETED AND BELONG TO SAME DATA SOURCE
            ?s a opm:Deleted ;
                opm:dataSource <${dsURI}> .
        }`;

    var x = await global.helpers.triplestoreConnection.getQuery(projectNumber, q);
    const URIs = x.results.bindings.map(item => item.s.value);

    return URIs;
}

// Put all new class assignments and their static properties (revit ID, GUID etc.) 
// in the main graph with a new time stamp assigned
const _writeNewClassAssignments = async () => {

    let ds = dsURI ? `opm:dataSource <${dsURI}> ;` : "";

    q = `
        PREFIX prov: <http://www.w3.org/ns/prov#>
        PREFIX opm: <https://w3id.org/opm#>
        INSERT {
            ?s a ?class ;
                ?key ?val ;
                ${ds}
                prov:generatedAtTime ?now
        }
        WHERE {
            # GET NEW CLASS ASSIGNMENTS FROM TEMP GRAPH
            GRAPH <${tempGraphURI}> {
                ?s a ?class ;
                    ?key ?val .
            }
            # MUST NOT ALREADY EXIST IN MAIN GRAPH
            MINUS {
                ?s a ?class
            }
            BIND(NOW() as ?now)
        }`;

    return global.helpers.triplestoreConnection.updateQuery(projectNumber,q);
}