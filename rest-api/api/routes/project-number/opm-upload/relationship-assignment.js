const m = require('./methods');
const path = require('path')
const uploadsFolder = path.join(__dirname, '../../../../static/uploads')
const tempUploadFolder = path.join(uploadsFolder, '/temp')
const multer = require('multer')
const util = require('util')
const fs = require('fs')
const uuidv4 = require('uuid/v4');
const urljoin = require('url-join');

const deleteFile = util.promisify(fs.unlink)
const writeFile = util.promisify(fs.writeFile)

var upload = multer({
    dest: tempUploadFolder
}).single('file')

// GLOBAL VARIABLES
var projectNumber;
var dsURI;

module.exports = (app) => {

    // DESCRIBE RESOURCE
    app.post('/:projNo/opm-upload/relationship-assignment', async (req, res, next) => {

        process.env.DEBUG && console.log(`Route: POST /${req.params.projNo}/opm-upload/relationship-assignment`);

        // Get data
        projectNumber = req.params.projNo;
        dsURI = req.query.dsURI;

        // Make URI for temp graph
        tempGraphURI = urljoin(process.env.DATA_NAMESPACE, projectNumber, 'rel-ass-temp');

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
            if(!triples) return next({msg: "No triples recieved", status: 400});

            const fileName = uuidv4().toString();
            const tempFilePath = path.join(tempUploadFolder, fileName);

            // Write triples to a file
            try{
                await writeFile(tempFilePath, triples)
            }catch(e){
                return next({msg: e, status: 500})
            }

            try{
                const msg = await _opmMain(projectNumber, tempFilePath, tempGraphURI);
                process.env.DEBUG && console.log('  - '+msg+'\n');
                res.send(msg);
            }catch(e){
                console.log(e);
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

                try{
                    const msg = await _opmMain(projectNumber, tempFilePath, tempGraphURI);
                    process.env.DEBUG && console.log('  - '+msg+'\n');
                    res.send(msg);
                }catch(e){
                    console.log(e);
                    return next({msg: e.message, status: e.status})
                }
            })
        }

    })

}

const _opmMain = async (projectNumber, tempFilePath, tempGraphURI) => {

    var msg = 'Successfully assigned relationships';    // Default message

    if(dsURI){
        // Upload file to temp graph in triplestore
        await global.helpers.triplestoreConnection.loadFile(projectNumber, tempFilePath, tempGraphURI);

        // Delete temp file (returns promise)
        var deleteTempPromise = deleteFile(tempFilePath);

        // Write triples
        await _writeRelationshipTriples(projectNumber, tempGraphURI, dsURI);

        // Clear temp graph
        await m.clearTempGraph(projectNumber, tempGraphURI);

        // Wait for file delete to resolve
        await deleteTempPromise;
    }

    // If no dsURI, simply load it in the graph
    if(!dsURI){
        await _loadInStore(projectNumber, tempFilePath);
    }

    if(dsURI){
        msg = "***OPM-REST SYNC LOG***\nSuccessfully performed relationship-assignment task.\n\n"+msg;
        await m.writeLog(projectNumber, msg, dsURI);
    }

    return msg;

}

// Simple method that simply loads the entire thing into the store
const _loadInStore = async (projectNumber, tempFilePath) => {

    // Upload file to the main graph
    await global.helpers.triplestoreConnection.loadFile(projectNumber, tempFilePath);

    // Delete temp file (returns promise)
    return deleteFile(tempFilePath);
}

// Writes the triples to the store and appends data source to subject and object
const _writeRelationshipTriples = async (projectNumber, tempGraphURI, dsURI) => {

    const q = `
    PREFIX opm: <https://w3id.org/opm#>
    INSERT{
        ?s ?rel ?o .
        ?s opm:dataSource <${dsURI}> .
        ?o opm:dataSource <${dsURI}> .
    }WHERE{
        GRAPH <${tempGraphURI}> {
            ?s ?rel ?o
        }
    }`;

    // return global.helpers.triplestoreConnection.updateQuery(projectNumber, q);
    return global.helpers.triplestoreConnection.updateQuery(projectNumber, q);

}