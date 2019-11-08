const fuseki = require('../../../../helpers/fuseki-connection');
const config = require('../../../../../config.json');
const OPMCalc = require('opm-qg').OPMCalc;
const urljoin = require('url-join');
const { check, validationResult } = require('express-validator/check');
const jsonld = require('jsonld');

module.exports = (app) => {

    // GET CALCULATIONS
    app.get('/:projNo/:discipline/calculations', async (req, res, next) => {

        process.env.DEBUG && console.log("Route: GET /:projNo/:discipline/calculations");

        // Get URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const namespace = urljoin(process.env.DATA_NAMESPACE, projNo, discipline);

        const opmCalc = new OPMCalc(namespace, config.prefixes);
        const q = opmCalc.listCalculations();
        
        try{
            var qRes = await fuseki.getQuery(projNo, q, 'application/ld+json');
            res.send(qRes);
        }catch(e){
            next({msg: e.message, status: e.status});
        }

    })

    // GET OUTDATED CALCULATIONS
    app.get('/:projNo/:discipline/calculations/outdated', async (req, res, next) => {

        process.env.DEBUG && console.log("Route: GET /:projNo/:discipline/calculations/outdated");

        // Get URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const namespace = urljoin(process.env.DATA_NAMESPACE, projNo, discipline);

        const opmCalc = new OPMCalc(namespace, config.prefixes);
        const q = opmCalc.getOutdated();
        console.log(q);
        
        try{
            var qRes = await fuseki.getQuery(projNo, q, 'application/ld+json');
            res.send(qRes);
        }catch(e){
            next({msg: e.message, status: e.status});
        }

    });

    // CREATE A CALCULATION
    app.post('/:projNo/:discipline/calculations',[
        check('label').exists(),
        check('expression').exists(),
        check('argumentPaths').exists(),
        check('inferredProperty').exists()
    ], async (req, res, next) => {

        process.env.DEBUG && console.log("Route: POST /:projNo/:discipline/calculations");

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next({msg: errors.array(), status: 422});
        }

        // Get URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const namespace = urljoin(process.env.DATA_NAMESPACE, projNo, discipline);

        // Get body
        const body = req.body;
        body.queryType = 'insert';

        // Generate query with opmCalc
        const opmCalc = new OPMCalc(namespace, config.namespaces);
        const q = opmCalc.postCalcData(body);

        try{
            await fuseki.updateQuery(projNo, q);
            res.send({msg: 'successfully created calculation'});
        }catch(e){
            next({msg: e.message, status: e.status});
        }

    })

    // GET SPECIFIC CALCULATION
    app.get('/:projNo/:discipline/calculations/:id', async (req, res, next) => {

        process.env.DEBUG && console.log("Route: GET /:projNo/:discipline/calculations/:id");

        // Get URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const id = req.params.id;
        const namespace = urljoin(process.env.DATA_NAMESPACE, projNo, discipline);
        const calculationURI = urljoin(namespace, 'calculations', id);

        const opmCalc = new OPMCalc(namespace);
        const q = opmCalc.getCalcData({calculationURI});

        process.env.DEBUG && console.log("---\n"+q);
        
        try{
            var qRes = await fuseki.getQuery(projNo, q, 'application/ld+json');
            res.send(qRes);
        }catch(e){
            next({msg: e.message, status: e.status});
        }

    })

}

_transformRes = async (graph) => {

    const context = {
        "@context": {
            "@vocab": "https://w3id.org/opm#",
            "inferredProperty": {"@id": "inferredProperty", "@type": "@id"},
            "foiRestriction": {"@id": "foiRestriction", "@type": "@id"},
            "argumentPaths": {"@id": "argumentPaths", "@container": "@list"}
        }
    };

    return await jsonld.compact(graph, context);
}