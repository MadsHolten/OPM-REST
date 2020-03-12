const fuseki = require('../../../helpers/fuseki-connection');
const config = require('../../../../config.json');
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
var dsURI;

module.exports = (app) => {

    // DESCRIBE RESOURCE
    app.post('/:projNo/opm-upload/class-create', async (req, res, next) => {

        process.env.DEBUG && console.log(`Route: POST /${req.params.projNo}/opm-upload/class-create`);

        // Get data
        const projNo = req.params.projNo;

        // A data source URI (dsURI) is optional, but required for deletion (and general insights)
        // When recieving new class creation, a check to the existing classes from the same data source will be made
        // Any existing class which belongs to the same dsURI and which is not found in the new
        // batch will be marked as opm:Deleted
        dsURI = req.query.dsURI;

        // Make URI for temp graph
        const tempGraphURI = urljoin(process.env.DATA_NAMESPACE, projNo, 'class-create-temp');

        // Get content type header
        const contentType = req.headers['content-type'];
        if(!contentType || contentType == undefined) return next({msg: "Please specify a content-type header", status: 400});

        // Set content-type of response
        res.type('text/plain')

        // Handle text
        if(contentType.indexOf('multipart/form-data') == -1){
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
                const msg = await _opmMain(projNo, tempFilePath, tempGraphURI);
                process.env.DEBUG && console.log('  - '+msg+'\n');
                res.send(msg);
            }catch(e){
                return next({msg: e.message, status: e.status})
            }
        }

        // Handle file
        else{

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
                    const msg = await _opmMain(projNo, tempFilePath, tempGraphURI);
                    process.env.DEBUG && console.log('  - '+msg+'\n');
                    res.send(msg);
                }catch(e){
                    return next({msg: e.message, status: e.status})
                }

            })
        }

    })

}

const _opmMain = async (projNo, tempFilePath, tempGraphURI) => {

    var msg;

    // Upload file to temp graph in triplestore
    await fuseki.loadFile(projNo, tempFilePath, tempGraphURI)

    // Delete temp file (returns promise)
    var deleteTempPromise = deleteFile(tempFilePath)

    // Count number of new classes that will be created
    var countNew = 0;
    try{
        var countNew = await _countNew();
    }catch(e){
        return next({msg: e.message, status: e.status});
    }

    // Insert new class assignments if such exist
    if(countNew !== 0){
        try{
            await _writeNewClasses();
            msg = `Successfully created ${countNew} classes`;
        }catch(e){
            console.log(e);
            return next({msg: e.message, status: e.status});
        }
    }else{
        msg = `All classes already exist in the main graph.`;
    }

    // Make sure temp file was deleted
    await deleteTempPromise;

    // Clear temp graph
    var q = `DELETE WHERE { GRAPH <${tempGraphURI}> {?s ?p ?o}}`;
    await fuseki.updateQuery(projNo,q);

    return msg;

}

const _countNew = async () => {
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

    var x = await fuseki.getQuery(projectNumber, q);
    const count = x.results.bindings.length;

    return count;
}

// Put all new classes and their static properties (revit ID, GUID etc.) 
// in the main graph with a new time stamp assigned
const _writeNewClasses = async () => {

    let ds = dsURI ? `opm:dataSource <${dsURI}> ;` : "";

    q = `
        PREFIX owl: <http://www.w3.org/2002/07/owl#>
        PREFIX prov: <http://www.w3.org/ns/prov#>
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

    return fuseki.updateQuery(projectNumber,q);
}