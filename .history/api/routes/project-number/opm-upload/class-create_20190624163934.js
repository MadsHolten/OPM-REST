const fuseki = require('../../../helpers/fuseki-connection');
const config = require('../../../../config.json');
const path = require('path');
const uploadsFolder = path.join(__dirname, '../../../../static/uploads');
const tempUploadFolder = path.join(uploadsFolder, '/temp');
const multer = require('multer');
const util = require('util');
const fs = require('fs');
const urljoin = require('url-join');

const deleteFile = util.promisify(fs.unlink);
const writeFile = util.promisify(fs.writeFile);

var upload = multer({
    dest: tempUploadFolder
}).single('file')

module.exports = (app) => {

    // DESCRIBE RESOURCE
    app.post('/:projNo/opm-upload/class-create', async (req, res, next) => {

        // Get data
        const projNo = req.params.projNo

        // Make URI for temp graph
        const tempGraphURI = urljoin(config.dataNamespace, projNo, 'class-create-temp');

        // Get content type header
        const contentType = req.headers['content-type']

        // Set content-type of response
        res.type('text/plain')

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
            
            // Do all the OPM stuff
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
                var tempFilePath = path.join(tempUploadFolder, req.file.filename)

                // Do all the OPM stuff
                try{
                    const msg = await _opmMain(projNo, tempFilePath, tempGraphURI)
                    res.send(msg)
                }catch(e){
                    next({msg: e.message, status: e.status})
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

    try{
        var x = await fuseki.getQuery(projNo, q);
        var count = x.results.bindings.length;
    }catch(e){
        next({msg: e.message, status: e.status});
    }

    if(count == 0){
        msg = `All classes already exist in the main graph.`;
    }

    else{
        msg = `Successfully created ${count} classes`;

        // Put all new classes and their static properties (revit ID, GUID etc.) 
        // in the main graph with a new time stamp assigned
        q = `
            PREFIX owl: <http://www.w3.org/2002/07/owl#>
            PREFIX prov: <http://www.w3.org/ns/prov#>
            INSERT {
                ?s a owl:Class ;
                    ?key ?val ;
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

        try{
            await fuseki.updateQuery(projNo,q);
        }catch(e){
            next({msg: e.message, status: e.status});
        }
    }

    // Make sure temp file was deleted
    await deleteTempPromise;

    // Clear temp graph
    var q = `DELETE WHERE { GRAPH <${tempGraphURI}> {?s ?p ?o}}`;
    await fuseki.updateQuery(projNo,q);

    return msg;

}