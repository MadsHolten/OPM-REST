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
}).single('file');

// GLOBAL VARIABLES
var projectNumber;
var tempGraphURI;
var sourceID;

module.exports = (app) => {

    // DESCRIBE RESOURCE
    app.post('/:projNo/opm-upload/class-assignment', async (req, res, next) => {

        process.env.DEBUG && console.log("Route: POST /:projNo/opm-upload/class-assignment");

        // Get project number and set global variable
        projectNumber = req.params.projNo;
        sourceID = req.query.sourceID;

        // A source ID is used for deletion
        // When recieving new class assignments a check to the existing instances will be made
        // Any existing instance which belongs to this sync ID and which is not found in the new
        // batch will be marked as opm:Deleted
        // The name of the Revit model could for example be used as an ID
        // If no ID is provided, the default 'opm-batch' will be used
        if(!sourceID) sourceID = 'opm-batch';

        // Make URI for temp graph
        tempGraphURI = urljoin(process.env.DATA_NAMESPACE, projectNumber, 'class-ass-temp');

        // Get content type header
        const contentType = req.headers['content-type'];

        // Set content-type of response
        res.type('text/plain');

        // Handle text
        if(contentType.indexOf('multipart/form-data') == -1){
            const triples = req.body;

            // Throw error if no data recieved
            if(!triples) next({msg: "No triples recieved", status: 400})

            const fileName = uuidv4().toString();
            const tempFilePath = path.join(tempUploadFolder, fileName)

            // Write triples to a file
            try{
                await writeFile(tempFilePath, triples)
            }catch(e){
                console.log(e)
                next({msg: e, status: 500})
            }
            
            // // Do all the OPM stuff
            try{
                const msg = await _opmMain(tempFilePath);
                process.env.DEBUG && console.log('  Project '+projectNumber);
                process.env.DEBUG && console.log('  - '+msg);
                res.send(msg);
            }catch(e){
                next({msg: e.message, status: e.status})
            }
        }

        // Handle file
        else{

            // Get file content and load it in temp graph
            upload(req, res, async (err) => {

                // Throw error if no file recieved
                if(!req.file) next({msg: "No file recieved", status: 400})

                // Throw error if upload fails
                if(err) next({msg: "File upload failed", status: 422})

                // Get temp file path
                const tempFilePath = path.join(tempUploadFolder, req.file.filename)

                // // Do all the OPM stuff
                try{
                    const msg = await _opmMain(tempFilePath, tempGraphURI);
                    process.env.DEBUG && console.log('  Project '+projectNumber);
                    process.env.DEBUG && console.log('  - '+msg);
                    res.send(msg);
                }catch(e){
                    next({msg: e.message, status: e.status})
                }

            });

        }

    })

}

const _opmMain = async (tempFilePath) => {

    var msg;

    // Upload file to temp graph in triplestore
    await fuseki.loadFile(projectNumber, tempFilePath, tempGraphURI)

    // Delete temp file (returns promise)
    var deleteTempPromise = deleteFile(tempFilePath)

    // Count number of new triples that will be created
    var countNew = 0;
    try{
        countNew = await _countNew();
    }catch(e){
        console.log(e);
        next({msg: e.message, status: e.status});
    }

    // Insert new classes if such exist
    if(countNew !== 0){
        try{
            await _writeNewClasses();
        }catch(e){
            console.log(e);
            next({msg: e.message, status: e.status});
        }
    }

    // Count number of deleted triples that should be marked as opm:Deleted
    var deletedInstances = [];
    try{
        deletedInstances = await _getDeleted();
    }catch(e){
        console.log(e);
        next({msg: e.message, status: e.status});
    }
    const countDeleted = deletedInstances.length;

    // Mark deleted classes
    if(countDeleted !== 0){
        try{
            await _deleteClasses(deletedInstances);
        }catch(e){
            console.log(e);
            next({msg: e.message, status: e.status});
        }
    }

    // Update result message if count = 0
    if(countNew == 0 && countDeleted == 0){
        msg = `All class assignments already exist in the main graph and nothing was deleted.`;
    }else{
        msg = `Assigned ${countNew} instances to a class and deleted ${countDeleted} instances that were missing in the batch.`;
    }

    await _clearTempGraph();

    // Make sure temp file was deleted
    await deleteTempPromise;

    return msg;

}

const _countNew = async () => {
    // Query to count the number of new classes that will be created
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

    var x = await fuseki.getQuery(projectNumber, q);
    const count = x.results.bindings.length;

    return count;
}

const _getDeleted = async () => {
    // Query to count the number of classes that will be marked as deleted

    var q = `
        PREFIX opm: <https://w3id.org/opm#>
        SELECT DISTINCT ?s
        WHERE {
            # GET EXISTING CLASS ASSIGNMENTS OF THINGS WITH THE CURRENT SOURCE ID
            ?s a ?class ;
                opm:sourceID "${sourceID}" .
            
            # Must not be classified as deleted already
            MINUS{ ?s a opm:Deleted }

            # MUST NOT EXIST IN TEMP GRAPH
            FILTER NOT EXISTS {
                GRAPH <${tempGraphURI}> {
                    ?s a ?class
                }
            }
        }`;

    var x = await fuseki.getQuery(projectNumber, q);
    const URIs = x.results.bindings.map(item => item.s.value);

    return URIs;
}

const _deleteClasses = async (URIs) => {

    // Rewrite list of URIs to SPARQL values format
    URIs = URIs.map(URI => `<${URI}>`).join(' ');

    var q = `
        PREFIX opm: <https://w3id.org/opm#>
        PREFIX prov: <http://www.w3.org/ns/prov#>
        INSERT {
            ?s a opm:Deleted ;
                prov:invalidatedAtTime ?now
        }
        WHERE {
            VALUES ?s { ${URIs} }
            BIND(NOW() as ?now)
        }`;

    return fuseki.updateQuery(projectNumber,q);

}

// Put all new class assignments and their static properties (revit ID, GUID etc.) 
// in the main graph with a new time stamp assigned
const _writeNewClasses = async () => {

    q = `
        PREFIX prov: <http://www.w3.org/ns/prov#>
        PREFIX opm: <https://w3id.org/opm#>
        INSERT {
            ?s a ?class ;
                ?key ?val ;
                opm:sourceID "${sourceID}" ;
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

    return fuseki.updateQuery(projectNumber,q);
}

const _clearTempGraph = async () => {

    // Clear temp graph
    var q = `DELETE WHERE { GRAPH <${tempGraphURI}> {?s ?p ?o}}`;
    return fuseki.updateQuery(projectNumber,q);

}