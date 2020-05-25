module.exports = {

    // Check if a JSON-LD graph item includes the specified type or a subset of it
    belongsToClass: (item, classStr) => {
        if(!item['@type']) return false;
        var types;
        if(Array.isArray(item['@type'])){
            types = item['@type'].join(' ');
        }else{
            types = item['@type'];
        }
        return types.includes(classStr);
    },

    clearTempGraph: async (projectNumber, graphURI) => {
        var q = `DELETE WHERE { GRAPH <${graphURI}> {?s ?p ?o}}`;
        return global.helpers.triplestoreConnection.updateQuery(projectNumber,q);
    },

    // The sync log
    writeLog: async (projectNumber, msg, dsURI, affectedURIs) => {

        msg = msg.split('\n').join('\\n'); // Escape line breaks

        let aff = false; // Append affected URIs?

        // Affected resources
        if(affectedURIs && affectedURIs.length){
            aff = true;
            affectedURIs = affectedURIs.map(URI => `<${URI}>`).join(' ');
        }

        // Could we refer new data to the exact sync job?
        let q = 
        `INSERT{
            ?sj a opm:SyncJob ;
                opm:hasLog "${msg}"@en ;
                prov:generatedAtTime ?now ;
                ${aff ? 'opm:affected ?affected ;' : ''}
                opm:syncedResource ?ds
        }
        WHERE{
            BIND(<${dsURI}> AS ?ds)
            BIND(IRI(CONCAT(REPLACE("${dsURI}", "(?!([^/]*/){2}).*", "sync-jobs/"), STRUUID())) AS ?sj)
            BIND(NOW() AS ?now)
            ${aff ? 'VALUES ?affected { '+affectedURIs+ ' }' : ''}
        }`;

        return global.helpers.triplestoreConnection.updateQuery(projectNumber,q);

    },

    // Assigns opm:Deleted to all the resources given in the URIs array
    markDeleted: async (projectNumber, URIs) => {

        // Rewrite list of URIs to SPARQL values format
        URIs = URIs.map(URI => `<${URI}>`).join(' ');
    
        var q = `
            PREFIX opm: <https://w3id.org/opm#>
            PREFIX prov: <http://www.w3.org/ns/prov#>
            INSERT {
                ?s a opm:Deleted ;
                    prov:invalidatedAtTime ?now
            }
            WHERE {
                VALUES ?s { ${URIs} }
                BIND(NOW() as ?now)
            }`;
    
        return global.helpers.triplestoreConnection.updateQuery(projectNumber,q);
    
    },

    // Removes the opm:Deleted from all the resources given in the URIs array
    unMarkDeleted: async (projectNumber, URIs) => {

        // Rewrite list of URIs to SPARQL values format
        URIs = URIs.map(URI => `<${URI}>`).join(' ');
    
        var q = `
            PREFIX opm: <https://w3id.org/opm#>
            PREFIX prov: <http://www.w3.org/ns/prov#>
            DELETE{
                ?s a opm:Deleted ;
                    prov:invalidatedAtTime ?t
            }
            WHERE {
                VALUES ?s { ${URIs} }
                ?s a opm:Deleted ;
                    prov:invalidatedAtTime ?t .
            }`;
    
        return global.helpers.triplestoreConnection.updateQuery(projectNumber,q);
    
    }

}