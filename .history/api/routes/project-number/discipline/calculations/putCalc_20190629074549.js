const fuseki = require('../../../../helpers/fuseki-connection');
const ldt = require('../../../../helpers/ld-tools');
const config = require('../../../../../config.json');
const OPMCalc = require('opm-qg').OPMCalc;
const urljoin = require('url-join');
const jsonld = require('jsonld');

module.exports = (app) => {

    // RE-APPNED CALCULATION
    app.put('/:projNo/:discipline/calculations/:id', async (req, res, next) => {

        config.DEBUG && console.log("Route: PUT /:projNo/:discipline/calculations/:id");

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
            // Build query with OPM-QG
            var query = opmCalc.getCalcData({calculationURI});
            config.DEBUG && console.log('---\n'+query);

            // Run query
            var qRes = await fuseki.getQuery(projNo, query, 'application/ld+json');
            calcData = await _transformRes(qRes);
            calcData.calculationURI = calculationURI;
        }catch(e){
            console.log(e)
            next({msg: e.message, status: e.status});
        }

        // Re-append calculation and return 
        try{
            if(materialize){
                // Append
                calcData.queryType = 'insert';
                query = opmCalc.putCalc(calcData);
                config.DEBUG && console.log('---\n'+query);
                
                await fuseki.updateQuery(projNo, query);

                res.send({msg: 'Successfully updated calculations.'});
            }else{
                // Build query with OPM-QG
                calcData.queryType = 'construct';
                query = opmCalc.putCalc(calcData);
                config.DEBUG && console.log('---\n'+query);

                var inserted = await fuseki.getQuery(projNo, query, 'application/ld+json');
                res.send(inserted);
            }
        }catch(e){
            console.log(e)
            next({msg: e.message, status: e.status});
        }

    })

}