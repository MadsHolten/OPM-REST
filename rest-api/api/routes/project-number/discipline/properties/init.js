const fuseki = require('../../../../helpers/fuseki-connection');
const config = require('../../../../../config.json');
const OPMProp = require('opm-qg').OPMProp;
const OPMCalc = require('opm-qg').OPMCalc;
const urljoin = require('url-join');
const { check, validationResult } = require('express-validator/check');
const jsonld = require('jsonld');

module.exports = (app) => {

    // GET PROPERTIES
    app.get('/:projNo/:discipline/properties', async (req, res, next) => {

        process.env.DEBUG && console.log("Route: GET /:projNo/:discipline/properties");

        // Get URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const namespace = urljoin(process.env.DATA_NAMESPACE, projNo, discipline);    
        
        try{
            // Build query with OPM-QG
            const opmProp = new OPMProp(namespace);
            const q = opmProp.getAllProps();
            
            process.env.DEBUG && console.log(q);

            // Run query
            var qRes = await fuseki.getQuery(projNo, q, 'application/ld+json');
            res.send(_buildOPMPropTree(qRes));
        }catch(e){
            next({msg: e.message, status: e.status});
        }

    })

    // GET SPECIFIC PROPERTY
    app.get('/:projNo/:discipline/properties/:id', async (req, res, next) => {

        process.env.DEBUG && console.log("Route: GET /:projNo/:discipline/properties/:id");

        // Get URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const id = req.params.id;
        const namespace = urljoin(process.env.DATA_NAMESPACE, projNo, discipline);
        const propURI = urljoin(namespace, 'properties', id);
        
        try{
            // Generate OPM query
            const opmProp = new OPMProp(namespace);
            const q = opmProp.getPropertyHistory(propURI);

            // Execute query
            var qRes = await fuseki.getQuery(projNo, q, 'application/ld+json');
            res.send(_buildOPMPropTree(qRes));
            // res.send(qRes);
        }catch(e){
            next({msg: e.message, status: e.status});
        }

    })

    // GET PROPERTY SUBSCRIBERS
    app.get('/:projNo/:discipline/properties/:id/subscribers', async (req, res, next) => {

        process.env.DEBUG && console.log("Route: GET /:projNo/:discipline/properties/:id/subscribers");

        // Get URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const id = req.params.id;
        const namespace = urljoin(process.env.DATA_NAMESPACE, projNo, discipline);
        const propertyURI = urljoin(namespace, 'properties', id);
        
        try{
            // Generate OPM query
            const opmCalc = new OPMCalc(namespace);
            const q = opmCalc.getSubscribers({propertyURI});

            // Execute query
            var qRes = await fuseki.getQuery(projNo, q, 'application/ld+json');
            res.send(qRes);
            // res.send(qRes);
        }catch(e){
            next({msg: e.message, status: e.status});
        }

    })

    // UPDATE PROPERTY
    app.put('/:projNo/:discipline/properties/:id', async (req, res, next) => {

        process.env.DEBUG && console.log("Route: PUT /:projNo/:discipline/properties/:id");

        // Get URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const id = req.params.id;
        const namespace = urljoin(process.env.DATA_NAMESPACE, projNo, discipline);
        const propertyURI = urljoin(namespace, 'properties', id);

        // Get URL parameter materialize
        // This is only used for calculations and indicates if the user only wants to see the result or
        // Wants to materialize it in the graph
        const materialize = req.query.materialize && req.query.materialize == 'true' ? true : false;

        // Get body
        const body = req.body.value;

        // If a value is provided in the body, update the value by inserting a new property state
        if(body && body.value){
            const value = `"${body.value}"^^<${body.type}>`;

            try{
                // Generate OPM query
                const opmProp = new OPMProp(namespace);
                const q = opmProp.putProperty(propertyURI, value);

                // Execute update query
                await fuseki.updateQuery(projNo, q);
                res.send({msg: "Successfully updated property"});
            }catch(e){
                next({msg: e.message, status: e.status});
            }
        }

        // If a value is not provided it is probably a derived property
        // Check if this is the case and update the calculated value
        if(!body || !body.value){

            // Check if it is attributed to some calculation
            try{
                // The following query will return the calculation data only if one or more of the arguments is outdated
                var q = 
                `CONSTRUCT{
                    ?calculationURI ?key ?val ;
                    opm:argumentPaths ?list .
                    ?listRest rdf:first ?head ;
                    rdf:rest ?tail .
                }
                WHERE{
                    BIND(<${propertyURI}> AS?property)
                    ?property opm:hasPropertyState ?previousState .
                    ?previousState a opm:CurrentPropertyState ;
                    prov:wasAttributedTo ?calculationURI ;
                    prov:wasDerivedFrom ?arg .
                    
                    ?arg a opm:OutdatedPropertyState .
                    
                    ?calculationURI ?key ?val ;
                    opm:argumentPaths ?list .
                    ?list rdf:rest* ?listRest .
                    ?listRest rdf:first ?head ;
                    rdf:rest ?tail .
                }`;

                var calcData;
                try{
                    var graph = await fuseki.getQuery(projNo, q, 'application/ld+json');

                    const context = {
                        "@context": {
                            "@vocab": "https://w3id.org/opm#",
                            "calculationURI" : "@id",
                            "inferredProperty": {"@id": "inferredProperty", "@type": "@id"},
                            "foiRestriction": {"@id": "foiRestriction", "@type": "@id"},
                            "argumentPaths": {"@id": "argumentPaths", "@container": "@list"}
                        }
                    };
                
                    calcData = await jsonld.compact(graph, context);
                }catch(e){
                    console.log(e);
                    next({msg: e, status: 500});
                }
                
                // If proper calculation data was returned, continue
                if(calcData['@type']){

                    calcData.propertyURI = propertyURI;
                    calcData.queryType = materialize ? 'insert' : 'construct';

                    try{
                        // Generate OPM query
                        const opmCalc = new OPMCalc(namespace, config.namespaces);
                        const q = opmCalc.putCalc(calcData);

                        if(materialize){
                            // Execute update query
                            await fuseki.updateQuery(projNo, q);
                            res.send({msg: "Successfully updated property"});
                        }else{
                            // Execute get query
                            const qRes = await fuseki.getQuery(projNo, q, 'application/ld+json');
                            res.send(qRes);
                        }
                        
                    }catch(e){
                        next({msg: e, status: 500});
                    }

                // If no calculation data was retrieved the property might not be outdated
                }else{
                    res.send({msg: "No new value was provided and if the property is a derived property it is up to date."});
                }

            }catch(e){
                next({msg: e.message, status: e.status});
            }

        }

    })
    
}

// NB! This should be extended to provide a more generic approach for building the trees
_buildOPMPropTreeNew = (jsonld) => {

    // Create tree structure
    var formatted = [];
    const root = jsonld['@graph'];

    root.forEach(item => {
        var keys = Object.keys(item);
        var values = Object.values(item);
        values.forEach((val, i) => {
            if(_isURI(val)){
                var match = root.find(x => x['@id'] == val)
                if(match){
                    item[keys[i]] == match;
                    root.pop(match)
                }
            }
        })

        return item;
    })

    jsonld['@graph'] = formatted;
    return formatted;
    
}

_isURI = (str) => {
    return /^http/.test(str);
}

_buildOPMPropTree = (jsonld) => {
    // Create tree structure
    var formatted = [];
    const root = jsonld['@graph'];

    root.forEach(item => {
        if(item.hasPropertyState){

            // Find each of the property states in the root
            if(typeof item.hasPropertyState == 'string'){
                const match = root.find(r => r['@id'] == item.hasPropertyState);
                item.hasPropertyState = match;
            }else{
                item.hasPropertyState.forEach((state,i) => {
                    const match = root.find(r => r['@id'] == state);
                    if(match){
                        item.hasPropertyState[i] = match;
                    }
                })
            }            
            
            formatted.push(item);
        }

        return item;
    })

    jsonld['@graph'] = formatted;
    return formatted;
    
}