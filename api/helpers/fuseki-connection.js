const rp = require('request-promise');
const config = require('../../config.json');

var baseURI = config.triplestoreEndpoint;

var mainObject = {};

mainObject.getQuery = async (dbName, q, mimeType) => {

    if(!mimeType) mimeType = 'application/sparql-results+json';

    var options = {
        method: 'POST',
        uri: `${baseURI}/${dbName}/query`,
        qs: {
            query: q
        },
        headers: {
            'Accept': mimeType
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
        }
    };

    return rp(options);
}

module.exports = mainObject;