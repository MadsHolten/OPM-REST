var config = require('../../config.json');
var namespaces = config.namespaces;

var ldt = {};

ldt.appendPrefixesToQuery = (query) => {
    
    // Extract namespaces used in the query
    var nsQ = ldt.nameSpacesInQuery(query);
    
    // Get the URIs of the prefixes and append them to the query
    var p = '';
    nsQ.forEach(namespace => {
        var match = config.namespaces.filter(ns => ns.prefix == namespace)[0];
        if(match){
            p+= `PREFIX  ${namespace}: <${match.uri}>\n`;
        }
        else {
            return new Error('Unknown prefix '+namespace);
        }
    })
    return p+query;

}
    
ldt.nameSpacesInQuery = (str) => {
    var array = [];

    const regex = /[a-zA-Z]+\:/g;
    let m;
    
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        
        // The result can be accessed through the `m`-variable.
        m.forEach((match) => {
            match = match.slice(0, -1);
            if(array.indexOf(match) == -1){
                array.push(match);
            }
        });
    }
    return array;
}

ldt.appendContext = (prefixedURI) => {
    // Must contain a colon
    if(prefixedURI.indexOf(":") == -1) return prefixedURI;

    var subElements = prefixedURI.split(":");
    var ns = subElements[0];
    var rest = subElements[1];

    var match = namespaces.filter(pfx => pfx.prefix == ns)[0];
    if(!match || !match.uri) return prefixedURI;

    return match.uri+rest;
}

/**
 * Takes a graph and appends matching '@id's in a tree structure
 * 
 * Example:
 * [
 *      {
 *          "@id": "http://x",
 *          "someProp": "http://y"
 *      },
 *      {
 *          "@id": "http://y",
 *          "hasPropertyState": "http://z"
 *      },
 *      {
 *          "@id": "http://z",
 *          "value": "abc"
 *      }
 * ]
 * Becomes:
 * [
 *      {
 *          "@id": "http://x",
 *          "someProp": {
 *              "@id": "http://y",
 *              "hasPropertyState": {
 *                  "@id": "http://z",
 *                  value: "abc"
 *              }
 *          }
 *      }
 * ]
 *  */ 
ldt.buildJSONLDTrees = async (graph) => {

    if(graph == undefined) return graph;

    return new Promise((resolve, reject) => {

        graph = graph.map((item, i) => {
            if(item['@id']){

                // Find match
                graph.forEach(item2 => {
                    Object.keys(item2).forEach(key => {

                        // If the value of the object item is equal to the item['@id']
                        // And IMPORTANT that it is not the item itself
                        if(item2[key] == item['@id'] && key != '@id'){

                            // Overwrite value with a copy of the object
                            item2[key] = JSON.parse(JSON.stringify(item));

                            // Set id to null to indicate that this item has been copied to a tree
                            item['@id'] = null;

                        }
                    })
                });
            }
            return item;
        })
        .filter(item => item['@id'] != null);

        resolve(graph);

    });
}

module.exports = ldt;