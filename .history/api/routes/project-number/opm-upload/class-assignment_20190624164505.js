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

module.exports = (app) => {

    // DESCRIBE RESOURCE
    app.post('/:projNo/opm-upload/class-assignment', async (req, res, next) => {

        config.DEBUG && console.log("Route: POST /:projNo/opm-upload/class-assignment");

        // Get data
        const projNo = req.params.projNo;

        // Make URI for temp graph
        const tempGraphURI = urljoin(config.dataNamespace, projNo, 'class-ass-temp');

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
                const msg = await _opmMain(projNo, tempFilePath, tempGraphURI)
                res.send(msg)
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
                    const msg = await _opmMain(projNo, tempFilePath, tempGraphURI)
                    res.send(msg)
                }catch(e){
                    next({msg: e.message, status: e.status})
                }

            });

        }

    })

}

const _opmMain = async (projNo, tempFilePath, tempGraphURI) => {

    var msg;

    // Upload file to temp graph in triplestore
    await fuseki.loadFile(projNo, tempFilePath, tempGraphURI)

    // Delete temp file (returns promise)
    var deleteTempPromise = deleteFile(tempFilePath)

    // Query to count the number of new classes that will be created
    var q = `
        SELECT ?s
        WHERE {
            # GET NEW CLASS ASSIGNMENTS FROM TEMP GRAPH
            GRAPH <${tempGraphURI}> {
                ?s a ?class
            }
            # MUST NOT ALREADY EXIST IN MAIN GRAPH
            MINUS {
                ?s a ?class
            }
        }`
    
    try{
        var x = await fuseki.getQuery(projNo, q)
        var count = x.results.bindings.length
    }catch(e){
        next({msg: e.message, status: e.status})
    }

    // Update result message if count = 0
    if(count == 0){
        msg = `All class assignments already exist in the main graph.`;
    }

    else{
        // Put all new class assignments and their static properties (revit ID, GUID etc.) 
        // in the main graph with a new time stamp assigned
        q = `
            PREFIX prov: <http://www.w3.org/ns/prov#>
            INSERT {
                ?s a ?class ;
                    ?key ?val ;
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

        try{
            await fuseki.updateQuery(projNo,q);
            msg = `Successfully assigned ${count} new classes`;
        }catch(e){
            next({msg: e.message, status: e.status});
        }

    }

    // Clear temp graph
    var q = `DELETE WHERE { GRAPH <${tempGraphURI}> {?s ?p ?o}}`;
    await fuseki.updateQuery(projNo,q);

    // Make sure temp file was deleted
    await deleteTempPromise;

    return msg;

}