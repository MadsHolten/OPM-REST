const fuseki = require('../../../../helpers/fuseki-connection');
const config = require('../../../../../config.json');
const OPMProp = require('opm-qg').OPMProp;
const urljoin = require('url-join');
const { check, validationResult } = require('express-validator/check');
const jsonld = require('jsonld');

module.exports = (app) => {

    // GET PROPERTIES
    app.get('/:projNo/:discipline/properties', async (req, res, next) => {

        config.DEBUG && console.log("Route: GET /:projNo/:discipline/properties");

        // Get URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const namespace = urljoin(config.dataNamespace, projNo, discipline);    
        
        try{
            // Build query with OPM-QG
            const opmProp = new OPMProp(namespace);
            const q = opmProp.getAllProps();
            
            config.DEBUG && console.log(q);

            // Run query
            var qRes = await fuseki.getQuery(projNo, q, 'application/ld+json');
            res.send(_buildOPMPropTree(qRes));
        }catch(e){
            next({msg: e.message, status: e.status});
        }

    })

    // GET SPECIFIC PROPERTY
    app.get('/:projNo/:discipline/properties/:id', async (req, res, next) => {

        config.DEBUG && console.log("Route: GET /:projNo/:discipline/properties/:id");

        // Get URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const id = req.params.id;
        const namespace = urljoin(config.dataNamespace, projNo, discipline);
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

    // UPDATE PROPERTY
    app.put('/:projNo/:discipline/properties/:id', async (req, res, next) => {

        config.DEBUG && console.log("Route: PUT /:projNo/:discipline/properties/:id");

        // Get URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const id = req.params.id;
        const namespace = urljoin(config.dataNamespace, projNo, discipline);
        const propertyURI = urljoin(namespace, 'properties', id);

        // Get body
        const body = req.body.value;
        const value = `"${body.value}"^^<${body.type}>`;

        try{
            // Generate OPM query
            const opmProp = new OPMProp(namespace);
            const q = opmProp.putProperty(propertyURI, value);

            console.log(q)

            // Execute update query
            await fuseki.updateQuery(projNo, q);
            res.send({msg: "Successfully updated property"});
        }catch(e){
            next({msg: e.message, status: e.status});
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
                    console.log(match)
                    item[keys[i]] == match;
                    root.pop(match)
                }
            }
        })
        console.log(item)
        // keys.forEach(key => {

        // })
        // if(item['@id']){
        //     var match = root.find(x => x == item['@id']);
        //     console.log(item['@id'])
        // }
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
            console.log(item.hasPropertyState)
            // Find each of the property states in the root
            // pStates.forEach(state => {
            //     // console.log(state)
            //     // const match = root.find(r => r['@id'] == state);
            //     // console.log(match)
            // })
            
            
        }
        // const keys = Object.keys(item);
        // keys.forEach(key => {
        //     if(key == 'hasPropertyState'){
        //         const match = root.find(r => r['@id'] == item[key]);
        //         // console.log(match)
        //         if(match){
        //             item.hasPropertyState = match;
        //             formatted.push(item);
        //         }
        //     }
        // });
        return item;
    })

    jsonld['@graph'] = formatted;
    return formatted;
    
}