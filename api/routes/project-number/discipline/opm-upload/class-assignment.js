const fuseki = require('../../../../helpers/fuseki-connection');
const uriGen = require('../../../../helpers/uri-create');
const config = require('../../../../../config.json')
const multer = require('multer')

var upload = multer({
    dest: tempUploadFolder
}).single('file')

module.exports = (app) => {

    // DESCRIBE RESOURCE
    app.post('/:projNo/:discipline/opm-upload', async (req, res) => {

        // Get data
        const projNo = req.params.projNo

        // 
        const tempGraphURI = `${config.dataNamespace}/${projNo}/class-ass-temp`

        res.send('x')

    })

}