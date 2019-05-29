const fuseki = require('../../../helpers/fuseki-connection')
const ldTools = require('../../../helpers/ld-tools')
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
    app.post('/:projNo/opm-upload/class-property-assignment', async (req, res, next) => {

        // Get data
        const projNo = req.params.projNo
        var msg
        var countNew = 0
        countUpdated = 0


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

            // Query to count the number of new properties that will be created
            var q = _opmBatchClassCreate(tempGraphURI, 'select')
            try{
                var x = await fuseki.getQuery(projNo, q)
                countNew = x.results.bindings.length
                console.log(countNew)
            }catch(e){
                next({msg: e.message, status: e.status})
            }

            // Query to count the number of properties that will be updated
            var q = _opmBatchClassUpdate(tempGraphURI, 'select')
            try{
                var x = await fuseki.getQuery(projNo, q)
                countUpdated = x.results.bindings.length
            }catch(e){
                next({msg: e.message, status: e.status})
            }

            if(countNew != 0){
                // Insert new properties
                q = _opmBatchClassCreate(tempGraphURI, 'insert')
                console.log(q)
                try{
                    await fuseki.updateQuery(projNo,q)
                }catch(e){
                    next({msg: e.message, status: e.status})
                }
            }
    
            if(countUpdated != 0){
                // Insert new property states
                q = _opmBatchClassUpdate(tempGraphURI, 'insert')
                try{
                    await fuseki.updateQuery(projNo,q)
                }catch(e){
                    next({msg: e.message, status: e.status})
                }
            }

            // Clear temp graph
            q = `DELETE WHERE { GRAPH <${tempGraphURI}> {?s ?p ?o}}`
            await fuseki.updateQuery(projNo,q)
            
            // Make sure temp file was deleted
            await deleteTempPromise;

            var msg = `Assigned ${countNew} new properties and updated ${countUpdated} existing properties for classes`

            res.send(msg)

        })

    })

}

var _opmBatchClassCreate = (tempGraphURI, queryType) => {

    if(!queryType) queryType = "select"

    q = ""
        
    if(queryType.toLowerCase() == 'select'){
        q+= "SELECT DISTINCT ?classURI ?prop\n"
    }else{
        q+= `${queryType.toUpperCase()} {`

        q+= `?classURI rdfs:subClassOf ?restrictionURI .
            ?restrictionURI a owl:Restriction ;
                owl:onProperty ?prop ;
                owl:hasValue ?propURI .
            ?propURI opm:hasPropertyState ?stateURI .
            ?stateURI a opm:CurrentPropertyState , opm:InitialPropertyState ;
                schema:value ?val ;
                prov:generatedAtTime ?now ;
                prov:wasAttributedTo "Arch-Revit-Model" .
            }\n`
    }

    q+= `WHERE {
            GRAPH <${tempGraphURI}> {
                ?classURI ?prop ?val
            }
            MINUS {
                ?classURI rdfs:subClassOf [
                    a owl:Restriction ;
                    owl:onProperty ?prop ;
                    owl:hasValue ?x
                ] .
            }`;

    if(queryType.toLowerCase() != 'select'){
        q+= `BIND(IRI(CONCAT(REPLACE(STR(?classURI), "(?!([^/]*/){2}).*", "properties/"), STRUUID())) AS ?propURI)
            BIND(IRI(CONCAT(REPLACE(STR(?classURI), "(?!([^/]*/){2}).*", "states/"), STRUUID())) AS ?stateURI)
            BIND(IRI(CONCAT(REPLACE(STR(?classURI), "(?!([^/]*/){2}).*", "restrictions/"), STRUUID())) AS ?restrictionURI)
            BIND(NOW() AS ?now)\n`
    }

    q+= `}`

    return ldTools.appendPrefixesToQuery(q)

}

var _opmBatchClassUpdate = (tempGraphURI, queryType) => {
    
    if(!queryType) queryType = "select"

    q = ""
        
    if(queryType.toLowerCase() == 'select'){
        q+= "SELECT DISTINCT ?classURI ?prop\n"
    }else{        
        if(queryType.toLowerCase() == 'insert'){
            q+= `DELETE {
                    ?previousState a opm:CurrentPropertyState .
                }
                INSERT {\n`
        } else if(queryType.toLowerCase() == 'construct'){
            q+= `CONSTRUCT {\n`
        }

        q+= `?propURI opm:hasPropertyState ?stateURI .
                ?stateURI a opm:CurrentPropertyState ;
                    schema:value ?newVal ;
                    prov:generatedAtTime ?now ;
                    prov:wasAttributedTo "Arch-Revit-Model" .
            }\n`;
    }

    q+= `WHERE {
            GRAPH <${tempGraphURI}> {
                ?classURI ?prop ?newVal
            }
            ?classURI rdfs:subClassOf [
                a owl:Restriction ;
                owl:onProperty ?prop ;
                owl:hasValue ?propURI
            ] .
            ?propURI opm:hasPropertyState ?previousState .
            ?previousState a opm:CurrentPropertyState ;
                schema:value ?currentVal .
            FILTER(xsd:string(?newVal) != xsd:string(?currentVal))\n`
    
    if(queryType.toLowerCase() != 'select'){
        q+= `BIND(IRI(CONCAT(REPLACE(STR(?classURI), "(?!([^/]*/){2}).*", "states/"), STRUUID())) AS ?stateURI)
            BIND(NOW() AS ?now)\n`
    }

    q+= `}`

    return ldTools.appendPrefixesToQuery(q);

}