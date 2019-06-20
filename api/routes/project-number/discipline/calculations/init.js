const fuseki = require('../../../../helpers/fuseki-connection');
const config = require('../../../../../config.json');
const OPMCalc = require('opm-qg').OPMCalc;
const urljoin = require('url-join');
const { check, validationResult } = require('express-validator/check');
const jsonld = require('jsonld');

module.exports = (app) => {

    // GET CALCULATIONS
    app.get('/:projNo/:discipline/calculations', async (req, res, next) => {

        // Get URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const namespace = urljoin(config.dataNamespace, projNo, discipline);

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

        // Get URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const namespace = urljoin(config.dataNamespace, projNo, discipline);

        const opmCalc = new OPMCalc(namespace, config.prefixes);
        const q = opmCalc.getOutdated();
        
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

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next({msg: errors.array(), status: 422});
        }

        // Get URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const namespace = urljoin(config.dataNamespace, projNo, discipline);

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

        res.send({q});

    })

    // GET SPECIFIC CALCULATION
    app.get('/:projNo/:discipline/calculations/:id', async (req, res, next) => {

        // Get URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const id = req.params.id;
        const namespace = urljoin(config.dataNamespace, projNo, discipline);
        const calculationURI = urljoin(namespace, 'calculations', id);

        const opmCalc = new OPMCalc(namespace);
        const q = opmCalc.getCalcData(calculationURI);
        
        try{
            var qRes = await fuseki.getQuery(projNo, q, 'application/ld+json');
            res.send(qRes);
        }catch(e){
            next({msg: e.message, status: e.status});
        }

    })

    // APPEND CALCULATION
    app.post('/:projNo/:discipline/calculations/:id', async (req, res, next) => {

        // URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const id = req.params.id;

        // Query params
        const materialize = req.query.materialize;

        // Build URI and initialize OPMCalc
        const namespace = urljoin(config.dataNamespace, projNo, discipline);
        const calculationURI = urljoin(namespace, 'calculations', id);
        const opmCalc = new OPMCalc(namespace, config.namespaces);

        // Get calculation data
        var calcData;
        try{
            var query = opmCalc.getCalcData({calculationURI});
            var qRes = await fuseki.getQuery(projNo, query, 'application/ld+json');
            calcData = await _transformRes(qRes);
            calcData.calculationURI = calculationURI;
        }catch(e){
            console.log(e)
        }

        // Append calculation and return 
        try{
            if(materialize){
                // Count number of results
                calcData.queryType = 'count';
                query = opmCalc.postCalc(calcData);
                var count = await fuseki.getQuery(projNo, query);
                count = count.results.bindings[0].count.value;
                var msg = count == 0 ? 'There were no new calculation results to insert' : `successfully inserted ${count} calculation results.`;

                // Append
                calcData.queryType = 'insert';
                query = opmCalc.postCalc(calcData);
                await fuseki.updateQuery(projNo, query);

                res.send({msg});
            }else{
                calcData.queryType = 'construct';
                query = opmCalc.postCalc(calcData);
                var inserted = await fuseki.getQuery(projNo, query, 'application/ld+json');
                res.send(inserted);
            }
        }catch(e){
            console.log(e)
        }

    })

    // RE-APPNED CALCULATION
    app.put('/:projNo/:discipline/calculations/:id', async (req, res, next) => {

        // URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const id = req.params.id;

        // Query params
        const materialize = req.query.materialize;

        // Build URI and initialize OPMCalc
        const namespace = urljoin(config.dataNamespace, projNo, discipline);
        const calculationURI = urljoin(namespace, 'calculations', id);
        const opmCalc = new OPMCalc(namespace, config.namespaces);

        // Get calculation data
        var calcData;
        try{
            var query = opmCalc.getCalcData({calculationURI});
            var qRes = await fuseki.getQuery(projNo, query, 'application/ld+json');
            calcData = await _transformRes(qRes);
            calcData.calculationURI = calculationURI;
        }catch(e){
            console.log(e)
        }

        // Re-append calculation and return 
        try{
            if(materialize){
                // Append
                calcData.queryType = 'insert';
                query = opmCalc.putCalc(calcData);
                await fuseki.updateQuery(projNo, query);

                res.send({msg: 'Successfully updated calculations.'});
            }else{
                calcData.queryType = 'construct';
                query = opmCalc.putCalc(calcData);
                var inserted = await fuseki.getQuery(projNo, query, 'application/ld+json');
                res.send(inserted);
            }
        }catch(e){
            console.log(e)
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