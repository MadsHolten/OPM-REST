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

module.exports = (app) => {

    // DESCRIBE RESOURCE
    app.post('/:projNo/opm-upload/relationship-assignment', async (req, res, next) => {

        process.env.DEBUG && console.log(`Route: POST /${req.params.projNo}/opm-upload/relationship-assignment`);

        // Get data
        const projNo = req.params.projNo
        var msg = 'Successfully assigned relationships';    // Default message

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
                await _loadInStore(projNo, tempFilePath);
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
                    await _loadInStore(projNo, tempFilePath);
                    process.env.DEBUG && console.log('  - '+msg+'\n');
                    res.send(msg);
                }catch(e){
                    return next({msg: e.message, status: e.status})
                }
            })
        }

    })

}

const _loadInStore = async (projNo, tempFilePath) => {

    // Upload file to the main graph
    await fuseki.loadFile(projNo, tempFilePath)

    // Delete temp file (returns promise)
    await deleteFile(tempFilePath)

    return;
}