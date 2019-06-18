const fuseki = require('../../../../helpers/fuseki-connection');
const config = require('../../../../../config.json');
const OPMCalc = require('opm-qg').OPMCalc;
const urljoin = require('url-join');
const { check, validationResult } = require('express-validator/check');
const jsonld = require('jsonld');

module.exports = (app) => {

    // GET CALCULATION
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

    // CREATE A CALCULATION
    app.post('/:projNo/:discipline/calculations/:id', async (req, res, next) => {

        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const id = req.params.id;
        const namespace = urljoin(config.dataNamespace, projNo, discipline);
        const calculationURI = urljoin(namespace, 'calculations', id);

        // Generate query with opmCalc
        const opmCalc = new OPMCalc(namespace, config.namespaces);
        var query;
        try{
            query = opmCalc.getCalcData({calculationURI});
        }catch(e){
            console.log(e)
        }

        var calcData;
        try{
            var qRes = await fuseki.getQuery(projNo, query, 'application/ld+json');
            calcData = await _transformRes(qRes);
            calcData.calculationURI = calculationURI;
            calcData.queryType = 'construct';
        }catch(e){
            console.log(e)
        }

        try{
            query = opmCalc.postCalc(calcData);
        }catch(e){
            console.log(e);
        }

        console.log(query)

        try{
            var inserted = await fuseki.getQuery(projNo, query, 'application/ld+json');
            res.send(inserted);
        }catch(e){
            console.log(e)
        }

        // res.send(q);

        // const calcData = _getCalcData();

        // res.send({msg: 'WIP: POST calc'})

    })

    // CREATE A CALCULATION
    app.put('/:projNo/:discipline/calculations/:id', async (req, res, next) => {

        const projNo = req.params.projNo;
        const id = req.params.id;

        res.send({msg: 'WIP: PUT calc'})

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