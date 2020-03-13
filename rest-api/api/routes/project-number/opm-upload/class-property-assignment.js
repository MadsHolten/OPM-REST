const fuseki = require('../../../helpers/fuseki-connection');
const ldTools = require('../../../helpers/ld-tools');
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

module.exports = (app) => {

    // DESCRIBE RESOURCE
    app.post('/:projNo/opm-upload/class-property-assignment', async (req, res, next) => {

        process.env.DEBUG && console.log(`Route: POST /${req.params.projNo}/opm-upload/class-property-assignment`);

        // Get data
        projectNumber = req.params.projNo;

        // Make URI for temp graph
        tempGraphURI = urljoin(process.env.DATA_NAMESPACE, projectNumber, 'class-prop-ass-temp');

        // Get content type header
        const contentType = req.headers['content-type'];
        if(!contentType || contentType == undefined) return next({msg: "Please specify a content-type header", status: 400});

        // Set content-type of response
        res.type('text/plain');

        // Handle text
        if(contentType.indexOf('multipart/form-data') == -1){
            const triples = req.body;

            // Throw error if no data recieved
            if(!triples) return next({msg: "No triples recieved", status: 400});

            const fileName = uuidv4().toString();
            const tempFilePath = path.join(tempUploadFolder, fileName);

            // Write triples to a file
            try{
                await writeFile(tempFilePath, triples);
            }catch(e){
                console.log(e);
                return next({msg: e, status: 500});
            }
            
            // Do all the OPM stuff
            try{
                const msg = await _opmMain(projectNumber, tempFilePath, tempGraphURI);
                process.env.DEBUG && console.log('  - '+msg+'\n');
                res.send(msg);
            }catch(e){
                return next({msg: e.message, status: e.status});
            }
        }

        // Handle file
        else{

            // Get file content and load it in temp graph
            upload(req, res, async (err) => {

                // Throw error if no file recieved
                if(!req.file) return next({msg: "No file recieved", status: 400});

                // Throw error if upload fails
                if(err) return next({msg: "File upload failed", status: 422});

                // Get temp file path
                const tempFilePath = path.join(tempUploadFolder, req.file.filename);

                // Do all the OPM stuff
                try{
                    const msg = await _opmMain(projectNumber, tempFilePath, tempGraphURI);
                    process.env.DEBUG && console.log('  - '+msg+'\n');
                    res.send(msg);
                }catch(e){
                    return next({msg: e.message, status: e.status});
                }

            })

        }

    })

}

const _opmMain = async (projectNumber, tempFilePath, tempGraphURI) => {

    // Upload file to temp graph in triplestore
    await fuseki.loadFile(projectNumber, tempFilePath, tempGraphURI);

    // Delete temp file (returns promise)
    var deleteTempPromise = deleteFile(tempFilePath);

    // Count the number of new properties that will be created
    const countNew = await _opmBatchClassPropertyCreate(tempGraphURI, 'select');

    // Count the number of properties that will be updated
    const countUpdated = await _opmBatchClassPropertyUpdate(tempGraphURI, 'select');

    // Insert new properties
    if(countNew != 0) await _opmBatchClassPropertyCreate(tempGraphURI, 'insert');

    // Insert new property states
    if(countUpdated != 0) await _opmBatchClassPropertyUpdate(tempGraphURI, 'insert');

    // Clear temp graph
    await _clearTempGraph();

    // Make sure temp file was deleted
    await deleteTempPromise;

    return `Assigned ${countNew} new properties and updated ${countUpdated} existing properties for classes`

}

const _opmBatchClassPropertyCreate = async (tempGraphURI, queryType) => {

    if(!queryType) queryType = "select"

    let q = ""
        
    if(queryType.toLowerCase() == 'select'){
        q+= "SELECT DISTINCT ?classURI ?prop\n"
    }else{
        q+= `${queryType.toUpperCase()} {`

        q+= `?classURI rdfs:subClassOf ?restrictionURI .
            ?restrictionURI a owl:Restriction ;
                owl:onProperty ?prop ;
                owl:hasValue ?propURI .
            ?propURI opm:hasPropertyState ?stateURI .
            ?stateURI a opm:PropertyState , opm:CurrentPropertyState , opm:InitialPropertyState ;
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

    q+= `}`;

    q = ldTools.appendPrefixesToQuery(q);

    if(queryType == 'select'){
        var x = await fuseki.getQuery(projectNumber, q);
        return x.results.bindings.length;
    }else if(queryType == 'insert'){
        return fuseki.updateQuery(projectNumber, q);
    }else{
        throw new Error("Please specify a valid query type");
    }

}

const _opmBatchClassPropertyUpdate = async (tempGraphURI, queryType) => {
    
    if(!queryType) queryType = "select"

    let q = ""
        
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

        q+= `?previousState a opm:OutdatedPropertyState .
            ?propURI opm:hasPropertyState ?stateURI .
                ?stateURI a opm:PropertyState , opm:CurrentPropertyState ;
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
        q+= `BIND(IRI(CONCAT(REPLACE(STR(?classURI), "(?!([^/]*/){2}).*", "xx/states/"), STRUUID())) AS ?stateURI)
            BIND(NOW() AS ?now)\n`
    }

    q+= `}`

    q = ldTools.appendPrefixesToQuery(q);

    if(queryType == 'select'){
        var x = await fuseki.getQuery(projectNumber, q);
        return x.results.bindings.length;
    }else if(queryType == 'insert'){
        return fuseki.updateQuery(projectNumber, q);
    }else{
        throw new Error("Please specify a valid query type");
    }

}

const _clearTempGraph = async () => {
    var q = `DELETE WHERE { GRAPH <${tempGraphURI}> {?s ?p ?o}}`;
    return fuseki.updateQuery(projectNumber,q);
}