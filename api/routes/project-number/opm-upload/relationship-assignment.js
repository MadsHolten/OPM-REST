const fuseki = require('../../../helpers/fuseki-connection')
const config = require('../../../../config.json')
const path = require('path')
const uploadsFolder = path.join(__dirname, '../../../../static/uploads')
const tempUploadFolder = path.join(uploadsFolder, '/temp')
const multer = require('multer')
const util = require('util')
const fs = require('fs')

const deleteFile = util.promisify(fs.unlink);

var upload = multer({
    dest: tempUploadFolder
}).single('file')

module.exports = (app) => {

    // DESCRIBE RESOURCE
    app.post('/:projNo/opm-upload/relationship-assignment', async (req, res, next) => {

        // Get data
        const projNo = req.params.projNo
        var msg = 'Successfully assigned relationships';    // Default message

        // Make URI for temp graph
        const tempGraphURI = `${config.dataNamespace}/${projNo}/class-ass-temp`

        // Get file content and load it in temp graph
        upload(req, res, async (err) => {

            // Throw error if no file recieved
            if(!req.file) next({msg: "No file recieved", status: 400})

            // Throw error if upload fails
            if(err) next({msg: "File upload failed", status: 422})

            // Get temp file path
            var tempFilePath = path.join(tempUploadFolder, req.file.filename)

            // Upload file to temp graph in triplestore
            await fuseki.loadFile(projNo, tempFilePath, tempGraphURI)

            // Delete temp file (returns promise)
            var deleteTempPromise = deleteFile(tempFilePath)

            // Make sure temp file was deleted
            await deleteTempPromise;

            res.send(msg);

        })

    })

}