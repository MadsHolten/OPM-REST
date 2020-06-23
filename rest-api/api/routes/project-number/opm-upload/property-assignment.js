const m = require('./methods');
const path = require('path')
const uploadsFolder = path.join(__dirname, '../../../../static/uploads')
const tempUploadFolder = path.join(uploadsFolder, '/temp')
const multer = require('multer')
const util = require('util')
const fs = require('fs')
const urljoin = require('url-join');
const uuidv4 = require('uuid/v4');

const deleteFile = util.promisify(fs.unlink)
const writeFile = util.promisify(fs.writeFile)

var upload = multer({
    dest: tempUploadFolder
}).single('file')

// GLOBAL VARIABLES
var projectNumber;
var tempGraphURI;
var dsURI;

module.exports = (app) => {

    // DESCRIBE RESOURCE
    app.post('/:projNo/opm-upload/property-assignment', async (req, res, next) => {

        process.env.DEBUG && console.log(`Route: POST /${req.params.projNo}/opm-upload/property-assignment`);

        // Get data
        projectNumber = req.params.projNo;
        dsURI = req.query.dsURI;

        // Make URI for temp graph
        tempGraphURI = urljoin(process.env.DATA_NAMESPACE, projectNumber, 'prop-ass-temp');

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

            // Write triples to a file
            const fileName = uuidv4().toString();
            const tempFilePath = path.join(tempUploadFolder, fileName);
            try{
                await writeFile(tempFilePath, triples);
                console.log("Wrote local file");
            }catch(e){
                console.log("Not possible to write triples to local file.");
                return next({msg: e, status: 500})
            }
            
            // Do all the OPM stuff
            try{
                const msg = await _opmMain(projectNumber, tempFilePath, tempGraphURI);
                process.env.DEBUG && console.log('  - '+msg+'\n');
                res.send(msg)
            }catch(e){
                console.log("Something failed");
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

                // Do all the OPM stuff
                try{
                    const msg = await _opmMain(projectNumber, tempFilePath, tempGraphURI);
                    process.env.DEBUG && console.log('  - '+msg+'\n');
                    res.send(msg)
                }catch(e){
                    return next({msg: e.message, status: e.status})
                }

            })
        }

    })

}

const _opmMain = async (projectNumber, tempFilePath, tempGraphURI) => {

    var msg;

    process.env.DEBUG && console.log(`Uploading file to temp graph in triplestore`);

    // Upload file to temp graph in triplestore
    await global.helpers.triplestoreConnection.loadFile(projectNumber, tempFilePath, tempGraphURI);

    process.env.DEBUG && console.log(`Deleting local temp file`);

    // Delete temp file (returns promise)
    var deleteTempPromise = deleteFile(tempFilePath)

    process.env.DEBUG && console.log(`Counting the number of new properties that will be created`);

    // Count the number of new properties that will be created
    const {newStates, newTriples} = await _opmBatchCreate();

    countNew = newStates.length;

    process.env.DEBUG && console.log(`Counting the number of new properties that will be updated`);

    // Count the number of properties that will be updated
    const {updatedStates, updatedTriples} = await _opmBatchUpdate();
    const countUpdated = updatedStates.length;

    // Insert new properties
    if(countNew != 0){
        process.env.DEBUG && console.log(`Inserting new properties`);
        process.env.DEBUG && console.log(newStates);
        await global.helpers.triplestoreConnection.loadTriples(projectNumber, newTriples, 'application/ld+json');
    }
        
    // Insert updated property states
    if(countUpdated != 0){
        process.env.DEBUG && console.log(`Inserting updated property states`);
        process.env.DEBUG && console.log(updatedStates);
        await Promise.all([
            global.helpers.triplestoreConnection.loadTriples(projectNumber, updatedTriples, 'application/ld+json'),
            _opmMarkOutdated()
        ]);
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
        msg = "***OPM-REST SYNC LOG***\nSuccessfully performed property-assignment task.\n\n"+msg;
        let affectedURIs = newStates.concat(updatedStates);
        await m.writeLog(projectNumber, msg, dsURI, affectedURIs);
    }

    // Make sure temp file was deleted
    await deleteTempPromise;

    return `Assigned ${countNew} new properties and updated ${countUpdated} existing properties`;

}

const _opmBatchCreate = async () => {

    let q = `CONSTRUCT{
            ?foiURI ?prop ?propURI .
            ?propURI opm:hasPropertyState ?stateURI .
            ?stateURI a opm:PropertyState , opm:CurrentPropertyState , opm:InitialPropertyState ;
                schema:value ?val ;
                prov:generatedAtTime ?now ;
                prov:wasAttributedTo "Arch-Revit-Model" .
        }
        WHERE {
            GRAPH <${tempGraphURI}> {
                ?foiURI ?prop ?val
            }
            MINUS {
                ?foiURI ?prop ?x
            }
            BIND( IRI( REPLACE( STR(?foiURI), "(?!([^/]*/){2}).*", "properties/${uuidv4()}" ) ) AS ?propURI )
            BIND( IRI( REPLACE(STR(?foiURI), "(?!([^/]*/){2}).*", "states/${uuidv4()}") ) AS ?stateURI )
            BIND(NOW() AS ?now)
        }`;
    
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
                ?foiURI ?prop ?newVal
            }
            ?foiURI ?prop ?propURI .
            ?propURI opm:hasPropertyState ?previousState .
            ?previousState a opm:CurrentPropertyState ;
                schema:value ?currentVal .
            FILTER(xsd:string(?newVal) != xsd:string(?currentVal))
        }`;
    return global.helpers.triplestoreConnection.updateQuery(projectNumber, q);
}

const _opmBatchUpdate = async () => {

    q = `CONSTRUCT {
            ?previousState a opm:OutdatedPropertyState ;
                prov:invalidatedAtTime ?now .
            ?propURI opm:hasPropertyState ?stateURI .
            ?stateURI a opm:PropertyState , opm:CurrentPropertyState ;
                schema:value ?newVal ;
                prov:generatedAtTime ?now ;
                prov:wasAttributedTo "Arch-Revit-Model" .
        }
        WHERE{
            GRAPH <${tempGraphURI}> {
                ?foiURI ?prop ?newVal
            }
            ?foiURI ?prop ?propURI .
            ?propURI opm:hasPropertyState ?previousState .
            ?previousState a opm:CurrentPropertyState ;
                schema:value ?currentVal .
            FILTER(xsd:string(?newVal) != xsd:string(?currentVal))
            BIND( IRI( REPLACE(STR(?foiURI), "(?!([^/]*/){2}).*", "states/${uuidv4()}") ) AS ?stateURI )
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