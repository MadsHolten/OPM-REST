const m = require('./methods');
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
var dsURI;

module.exports = (app) => {

    // DESCRIBE RESOURCE
    app.post('/:projNo/opm-upload/class-property-assignment', async (req, res, next) => {

        process.env.DEBUG && console.log(`Route: POST /${req.params.projNo}/opm-upload/class-property-assignment`);

        // Get data
        projectNumber = req.params.projNo;
        dsURI = req.query.dsURI;

        // Make URI for temp graph
        tempGraphURI = urljoin(process.env.DATA_NAMESPACE, projectNumber, 'class-prop-ass-temp');

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
                console.log(e);
                return next({msg: e.message, status: e.status});
            }
        }

        // Handle file
        else{

            process.env.DEBUG && console.log(`Handling file...`);

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
                    console.log(e);
                    return next({msg: e.message, status: e.status});
                }

            })

        }

    })

}

const _opmMain = async (projectNumber, tempFilePath, tempGraphURI) => {

    var msg = "";

    // Upload file to temp graph in triplestore
    await global.helpers.triplestoreConnection.loadFile(projectNumber, tempFilePath, tempGraphURI);

    // Delete temp file (returns promise)
    var deleteTempPromise = deleteFile(tempFilePath);

    // Count the number of new properties that will be created
    const {newStates, newTriples} = await _opmBatchClassPropertyCreate();
    countNew = newStates.length;

    // Count the number of properties that will be updated
    const {updatedStates, updatedTriples} = await _opmBatchClassPropertyUpdate();
    const countUpdated = updatedStates.length;

    // Insert new properties
    if(countNew != 0) await global.helpers.triplestoreConnection.loadTriples(projectNumber, newTriples, 'application/ld+json');

    // Insert updated property states
    if(countUpdated != 0){
        let promises = [
            global.helpers.triplestoreConnection.loadTriples(projectNumber, updatedTriples, 'application/ld+json'),
            _opmMarkOutdated()
        ];
        await Promise.all(promises);
    }

    // Clear temp graph
    await m.clearTempGraph(projectNumber, tempGraphURI);

    // Update result message
    if(countNew == 0 && countUpdated == 0){
        msg = `Nothing was created or updated. No changes were discovered.`;
    }else{
        if(countNew) msg+= `Assigned ${countNew} new properties`;
        if(countUpdated) msg+= `\nUpdated ${countUpdated} existing properties`;
    }

    if(dsURI){
        msg = "***OPM-REST SYNC LOG***\nSuccessfully performed class-property-assignment task.\n\n"+msg;
        let affectedURIs = newStates.concat(updatedStates);
        await m.writeLog(projectNumber, msg, dsURI, affectedURIs);
    }

    // Make sure temp file was deleted
    await deleteTempPromise;

    return msg;

}

const _opmBatchClassPropertyCreate = async () => {

    q= `CONSTRUCT{
            ?classURI rdfs:subClassOf ?restrictionURI .
            ?restrictionURI a owl:Restriction ;
                owl:onProperty ?prop ;
                owl:hasValue ?propURI .
            ?propURI opm:hasPropertyState ?stateURI .
            ?stateURI a opm:PropertyState , opm:CurrentPropertyState , opm:InitialPropertyState ;
                schema:value ?val ;
                prov:generatedAtTime ?now ;
                prov:wasAttributedTo "Arch-Revit-Model" .
        }
        WHERE {
            GRAPH <${tempGraphURI}> {
                ?classURI ?prop ?val
            }
            MINUS {
                ?classURI rdfs:subClassOf [
                    a owl:Restriction ;
                    owl:onProperty ?prop ;
                    owl:hasValue ?x
                ] .
            }
            BIND(IRI(CONCAT(REPLACE(STR(?classURI), "(?!([^/]*/){2}).*", "properties/"), STRUUID())) AS ?propURI)
            BIND(IRI(CONCAT(REPLACE(STR(?classURI), "(?!([^/]*/){2}).*", "states/"), STRUUID())) AS ?stateURI)
            BIND(IRI(CONCAT(REPLACE(STR(?classURI), "(?!([^/]*/){2}).*", "restrictions/"), STRUUID())) AS ?restrictionURI)
            BIND(NOW() AS ?now)
        }`

    let newTriples = await global.helpers.triplestoreConnection.getQuery(projectNumber, q, 'application/ld+json');

    let newStates = [];
    if(newTriples['@graph']){
        newStates = newTriples['@graph']
                    .filter(item => m.belongsToClass(item, 'CurrentPropertyState'))
                    .map(item => item['@id']);
    } 
    
    return{newStates, newTriples};
    
}

const _opmMarkOutdated = async () => {
    let q = `DELETE {
        ?previousState a opm:CurrentPropertyState .
    }
    WHERE{
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
        FILTER(xsd:string(?newVal) != xsd:string(?currentVal))
    }`;
return global.helpers.triplestoreConnection.updateQuery(projectNumber, q);
}

const _opmBatchClassPropertyUpdate = async () => {
    
    let q = `CONSTRUCT {
            ?previousState a opm:OutdatedPropertyState ;
                prov:invalidatedAtTime ?now .
            ?propURI opm:hasPropertyState ?stateURI .
                ?stateURI a opm:PropertyState , opm:CurrentPropertyState ;
                    schema:value ?newVal ;
                    prov:generatedAtTime ?now ;
                    prov:wasAttributedTo "Arch-Revit-Model" .
            }
            WHERE {
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
                FILTER(xsd:string(?newVal) != xsd:string(?currentVal))
                BIND(IRI(CONCAT(REPLACE(STR(?classURI), "(?!([^/]*/){2}).*", "xx/states/"), STRUUID())) AS ?stateURI)
                BIND(NOW() AS ?now)
            }`;

    let updatedTriples = await global.helpers.triplestoreConnection.getQuery(projectNumber, q, 'application/ld+json');

    let updatedStates = [];
    if(updatedTriples['@graph']){
        updatedStates = updatedTriples['@graph']
                            .filter(item => m.belongsToClass(item, 'CurrentPropertyState'))
                            .map(item => item['@id']);
    } 

    return{updatedStates, updatedTriples};

}