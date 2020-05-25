const rp = require('request-promise');
const path = require('path');
const fs = require('fs');
const ldt = require('./ld-tools');
const urljoin = require('url-join');

// Set base URI and authentication settings
const auth = `Basic ${Buffer.from(process.env.FUSEKI_USER + ":" + process.env.FUSEKI_PASS).toString('base64')}`;

var mainObject = {};

mainObject.getQuery = async (dbName, q, mimeType) => {

    process.env.DEBUG && console.log(`Executing get query`);

    if(!mimeType) mimeType = 'application/sparql-results+json';

    let uri = "";
    let payload = {};
    let headers = {'Accept': mimeType};

    // If Fuseki
    if(process.env.FUSEKI_HOST){
        q = ldt.appendPrefixesToQuery(q);
        uri = urljoin(process.env.FUSEKI_HOST, dbName, 'query');
        payload = {query: q};
        headers['Authorization'] = auth;
    }
    
    // If through triplestore middle layer
    else if(process.env.TRIPLESTORE_HOST){
        uri = urljoin(process.env.TRIPLESTORE_HOST, dbName, 'query');
        payload = {query: q, reasoning: false};
    }

    var options = {
        method: 'POST',
        uri,
        form: payload,
        headers,
        json: true
    };

    return rp(options);

}

mainObject.updateQuery = async (dbName,q) => {

    let uri = "";
    let payload = {};
    let headers = {};

    // If Fuseki
    if(process.env.FUSEKI_HOST){
        q = ldt.appendPrefixesToQuery(q);
        uri = urljoin(process.env.FUSEKI_HOST, dbName, 'update');
        payload = {update: q};
        headers['Authorization'] = auth;
    }
    
    // If through triplestore middle layer
    else if(process.env.TRIPLESTORE_HOST){
        uri = urljoin(process.env.TRIPLESTORE_HOST, dbName, 'query');
        payload = {query: q};
    }
    
    var options = {
        method: 'POST',
        uri,
        form: payload,
        headers
    };

    return rp(options);
}

mainObject.loadFile = async (dbName, filePath, namedGraph) => {

    // Extract file name from path
    var fileName = path.basename(filePath);

    let uri = "";
    let headers = {'content-type': 'multipart/form-data'};
    let formData = {};

    // If Fuseki
    if(process.env.FUSEKI_HOST){
        uri = urljoin(process.env.FUSEKI_HOST, dbName, 'data');
        headers['Authorization'] = auth;
        formData = {
            'files[]': {
                value: fs.createReadStream(filePath),
                options: {
                    fileName: fileName,
                    contentType: 'text/turtle'
                }
            }
        }
    }

    // If through triplestore middle layer
    else if(process.env.TRIPLESTORE_HOST){
        uri = urljoin(process.env.TRIPLESTORE_HOST, dbName, 'data');
        formData = {
            'file': {
                value: fs.createReadStream(filePath),
                options: {
                    fileName: fileName,
                    contentType: 'text/turtle'
                }
            }
        }
    }

    var options = {
        method: 'POST',
        uri,
        headers,
        formData
    };

    if(namedGraph) options.qs = {graph: namedGraph};

    return rp(options);

}

// Currently only supporting JSON-LD
mainObject.loadTriples = async (dbName, triples, mimeType, namedGraph) => {

    let uri = "";
    let headers = {'content-type': mimeType};

    // If Fuseki
    if(process.env.FUSEKI_HOST){
        uri = urljoin(process.env.FUSEKI_HOST, dbName, 'data');
        headers['Authorization'] = auth;
    }

    // If through triplestore middle layer
    else if(process.env.TRIPLESTORE_HOST){
        uri = urljoin(process.env.TRIPLESTORE_HOST, dbName, 'data');
    }

    var options = {
        method: 'POST',
        uri: uri,
        headers,
        body: JSON.stringify(triples)
    };

    if(namedGraph) options.qs = {graph: namedGraph};

    return rp(options);

}

module.exports = mainObject;