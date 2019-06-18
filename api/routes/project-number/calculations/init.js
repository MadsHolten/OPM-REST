const fuseki = require('../../../helpers/fuseki-connection');
const config = require('../../../../config.json');
const OPMCalc = require('opm-qg').OPMCalc;
const urljoin = require('url-join');
const { check, validationResult } = require('express-validator/check');

module.exports = (app) => {

    // GET CALCULATION
    app.get('/:projNo/calculations', async (req, res, next) => {

        // Get URL params
        const projNo = req.params.projNo;

        const opmCalc = new OPMCalc(urljoin(config.dataNamespace, projNo), config.prefixes);
        const q = opmCalc.listCalculations();
        
        try{
            var qRes = await fuseki.getQuery(projNo, q, 'application/ld+json');
            console.log(qRes)
            res.send(qRes);
        }catch(e){
            next({msg: e.message, status: e.status});
        }

    })

    // CREATE A CALCULATION
    app.post('/:projNo/calculations',[
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

        // Get body
        const body = req.body;
        body.queryType = 'insert';

        // Generate query with opmCalc
        const opmCalc = new OPMCalc(urljoin(config.dataNamespace, projNo), config.namespaces);
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
    app.post('/:projNo/calculations/:id', async (req, res, next) => {

        const projNo = req.params.projNo;
        const id = req.params.id;

        res.send({msg: 'WIP: POST calc'})

    })

    // CREATE A CALCULATION
    app.put('/:projNo/calculations/:id', async (req, res, next) => {

        const projNo = req.params.projNo;
        const id = req.params.id;

        res.send({msg: 'WIP: PUT calc'})

    })

}