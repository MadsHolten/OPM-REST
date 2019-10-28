const rp = require('request-promise')
const config = require('../../config.json')
const path = require('path')
const fs = require('fs')
const ldt = require('./ld-tools')

// Set base URI and authentication settings
const baseURI = process.env.FUSEKI_HOST ? process.env.FUSEKI_HOST : config.triplestoreEndpoint;
const auth = `Basic ${Buffer.from(process.env.FUSEKI_USER + ":" + process.env.FUSEKI_PASS).toString('base64')}`;

var mainObject = {};

mainObject.getQuery = async (dbName, q, mimeType) => {

    q = ldt.appendPrefixesToQuery(q);

    if(!mimeType) mimeType = 'application/sparql-results+json';

    var options = {
        method: 'POST',
        uri: `${baseURI}/${dbName}/query`,
        qs: {
            query: q
        },
        headers: {
            'Accept': mimeType,
            'Authorization': auth
        },
        json: true
    };

    return rp(options);

}

mainObject.updateQuery = async (dbName,q) => {
    
    var options = {
        method: 'POST',
        uri: `${baseURI}/${dbName}/update`,
        form: {
            update: q
        },
        headers: { 'Authorization': auth }
    };

    return rp(options);
}

mainObject.loadFile = async (dbName, filePath, namedGraph) => {

    // Extract file name from path
    var fileName = path.basename(filePath);

    var uri = `${baseURI}/${dbName}/data`;

    var options = {
        method: 'POST',
        uri: uri,
        headers: {
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
            'Authorization': auth
        },
        formData: {
            'files[]': {
                value: fs.createReadStream(filePath),
                options: {
                    fileName: fileName,
                    contentType: 'text/turtle'
                }
            }
        }
    };

    if(namedGraph) options.qs = {graph: namedGraph};

    return rp(options);

}

module.exports = mainObject;