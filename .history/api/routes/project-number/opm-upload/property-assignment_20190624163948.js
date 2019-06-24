const fuseki = require('../../../helpers/fuseki-connection')
const ldTools = require('../../../helpers/ld-tools')
const config = require('../../../../config.json')
const path = require('path')
const uploadsFolder = path.join(__dirname, '../../../../static/uploads')
const tempUploadFolder = path.join(uploadsFolder, '/temp')
const multer = require('multer')
const util = require('util')
const fs = require('fs')
const urljoin = require('url-join');

const deleteFile = util.promisify(fs.unlink)
const writeFile = util.promisify(fs.writeFile)

var upload = multer({
    dest: tempUploadFolder
}).single('file')

module.exports = (app) => {

    // DESCRIBE RESOURCE
    app.post('/:projNo/opm-upload/property-assignment', async (req, res, next) => {

        // Get data
        const projNo = req.params.projNo

        // Make URI for temp graph
        const tempGraphURI = urljoin(config.dataNamespace, projNo, 'prop-ass-temp');

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
            const tempFilePath = path.join(tempUploadFolder, fileName);

            // Write triples to a file
            try{
                await writeFile(tempFilePath, triples)
            }catch(e){
                next({msg: e, status: 500})
            }
            
            // Do all the OPM stuff
            try{
                const msg = await _opmMain(projNo, tempFilePath, tempGraphURI);
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

                // Do all the OPM stuff
                try{
                    const msg = await _opmMain(projNo, tempFilePath, tempGraphURI);
                    res.send(msg)
                }catch(e){
                    next({msg: e.message, status: e.status})
                }

            })
        }

    })

}

const _opmMain = async (projNo, tempFilePath, tempGraphURI) => {

    // Upload file to temp graph in triplestore
    await fuseki.loadFile(projNo, tempFilePath, tempGraphURI)

    // Delete temp file (returns promise)
    var deleteTempPromise = deleteFile(tempFilePath)

    // Query to count the number of new properties that will be created
    var q = _opmBatchCreate(tempGraphURI, 'select')

    try{
        var x = await fuseki.getQuery(projNo, q)
        var countNew = x.results.bindings.length
    }catch(e){
        next({msg: e.message, status: e.status})
    }

    // Query to count the number of properties that will be updated
    var q = _opmBatchUpdate(tempGraphURI, 'select')
    try{
        var x = await fuseki.getQuery(projNo, q);
        var countUpdated = x.results.bindings.length
    }catch(e){
        next({msg: e.message, status: e.status})
    }

    if(countNew != 0){
        // Insert new properties
        q = _opmBatchCreate(tempGraphURI, 'insert')
        await fuseki.updateQuery(projNo,q);
    }

    if(countUpdated != 0){
        // Insert new property states
        q = _opmBatchUpdate(tempGraphURI, 'insert')
        await fuseki.updateQuery(projNo,q);
    }

    // Clear temp graph
    q = `DELETE WHERE { GRAPH <${tempGraphURI}> {?s ?p ?o}}`
    await fuseki.updateQuery(projNo,q);

    // Make sure temp file was deleted
    await deleteTempPromise;

    return `Assigned ${countNew} new properties and updated ${countUpdated} existing properties`;

}

const _opmBatchCreate = (tempGraphURI, queryType) => {

    if(!queryType) queryType = "select";

    q = "";
        
    if(queryType.toLowerCase() == 'select'){
        q+= "SELECT DISTINCT ?foiURI ?prop\n";
    }else{
        q+= `${queryType.toUpperCase()} {`;
        
        q+= `?foiURI ?prop ?propURI .
            ?propURI opm:hasPropertyState ?stateURI .
            ?stateURI a opm:CurrentPropertyState , opm:InitialPropertyState ;
                schema:value ?val ;
                prov:generatedAtTime ?now ;
                prov:wasAttributedTo "Arch-Revit-Model" .
            }\n`;
    }

    q+= `WHERE {
            GRAPH <${tempGraphURI}> {
                ?foiURI ?prop ?val
            }
            MINUS {
                ?foiURI ?prop ?x
            }`;

    if(queryType.toLowerCase() != 'select'){
        q+= `BIND(IRI(CONCAT(REPLACE(STR(?foiURI), "(?!([^/]*/){2}).*", "properties/"), STRUUID())) AS ?propURI)
            BIND(IRI(CONCAT(REPLACE(STR(?foiURI), "(?!([^/]*/){2}).*", "states/"), STRUUID())) AS ?stateURI)
            BIND(NOW() AS ?now)\n`;
    }

    q+= `}`;

    return ldTools.appendPrefixesToQuery(q);
}

const _opmBatchUpdate = (tempGraphURI, queryType) => {
    
    if(!queryType) queryType = "select";

    q = "";
        
    if(queryType.toLowerCase() == 'select'){
        q+= "SELECT DISTINCT ?foiURI ?prop\n";
    }else{        
        if(queryType.toLowerCase() == 'insert'){
            q+= `DELETE {
                    ?previousState a opm:CurrentPropertyState .
                }
                INSERT {\n`;
        } else if(queryType.toLowerCase() == 'construct'){
            q+= `CONSTRUCT {\n`;
        }

        q+= `\t?propURI opm:hasPropertyState ?stateURI .
                ?stateURI a opm:CurrentPropertyState ;
                    schema:value ?newVal ;
                    prov:generatedAtTime ?now ;
                    prov:wasAttributedTo "Arch-Revit-Model" .
            }\n`;
    }

    q+= `WHERE {
            GRAPH <${tempGraphURI}> {
                ?foiURI ?prop ?newVal
            }
            ?foiURI ?prop ?propURI .
            ?propURI opm:hasPropertyState ?previousState .
            ?previousState a opm:CurrentPropertyState ;
                schema:value ?currentVal .
            FILTER(xsd:string(?newVal) != xsd:string(?currentVal))\n`;
    
    if(queryType.toLowerCase() != 'select'){
        q+= `BIND(IRI(CONCAT(REPLACE(STR(?foiURI), "(?!([^/]*/){2}).*", "states/"), STRUUID())) AS ?stateURI)
            BIND(NOW() AS ?now)\n`;
    }

    q+= `}`;

    return ldTools.appendPrefixesToQuery(q);
}