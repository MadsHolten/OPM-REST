const m = require('./methods');
const fuseki = require('../../../helpers/fuseki-connection')
const config = require('../../../../config.json')
const path = require('path')
const uploadsFolder = path.join(__dirname, '../../../../static/uploads')
const tempUploadFolder = path.join(uploadsFolder, '/temp')
const multer = require('multer')
const util = require('util')
const fs = require('fs')
const uuidv4 = require('uuid/v4');

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
        projectNumber = req.params.projNo
        dsURI = req.query.dsURI;

        // Get content type header
        const contentType = req.headers['content-type'];
        if(!contentType || contentType == undefined) return next({msg: "Please specify a content-type header", status: 400});

        // Set content-type of response
        res.type('text/plain')

        // Handle text
        if(contentType.indexOf('multipart/form-data') == -1){
            const triples = req.body

            // Throw error if no data recieved
            if(!triples) return next({msg: "No triples recieved", status: 400})

            const fileName = uuidv4().toString();
            const tempFilePath = path.join(tempUploadFolder, fileName);

            // Write triples to a file
            try{
                await writeFile(tempFilePath, triples)
            }catch(e){
                return next({msg: e, status: 500})
            }

            try{
                const msg = await _opmMain(projectNumber, tempFilePath);
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
                const tempFilePath = path.join(tempUploadFolder, req.file.filename)

                try{
                    const msg = await _opmMain(projectNumber, tempFilePath);
                    process.env.DEBUG && console.log('  - '+msg+'\n');
                    res.send(msg);
                }catch(e){
                    return next({msg: e.message, status: e.status})
                }
            })
        }

    })

}

const _opmMain = async (projectNumber, tempFilePath) => {

    var msg = 'Successfully assigned relationships';    // Default message

    await _loadInStore(projectNumber, tempFilePath);

    if(dsURI){
        msg = "***OPM-REST SYNC LOG***\nSuccessfully performed relationship-assignment task.\n\n"+msg;
        await m.writeLog(projectNumber, msg, dsURI);
    }

    return msg;

}

const _loadInStore = async (projectNumber, tempFilePath) => {

    // Upload file to the main graph
    await fuseki.loadFile(projectNumber, tempFilePath)

    // Delete temp file (returns promise)
    await deleteFile(tempFilePath)

    return;
}