const ldt = require('../../../../helpers/ld-tools');
const OPMCalc = require('opm-qg').OPMCalc;
const urljoin = require('url-join');
const jsonld = require('jsonld');

module.exports = (app) => {

    // RE-APPNED CALCULATION
    app.put('/:projNo/:discipline/calculations/:id', async (req, res, next) => {

        process.env.DEBUG && console.log("Route: PUT /:projNo/:discipline/calculations/:id");

        // URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const id = req.params.id;

        // Query params
        const materialize = req.query.materialize;

        // Build URI and initialize OPMCalc
        const namespace = urljoin(process.env.DATA_NAMESPACE, projNo, discipline);
        const calculationURI = urljoin(namespace, 'calculations', id);
        const opmCalc = new OPMCalc(namespace, global.config.namespaces);

        // Get calculation data
        var calcData;
        try{
            // Build query with OPM-QG
            var query = opmCalc.getCalcData({calculationURI});
            process.env.DEBUG && console.log('---\n'+query);

            // Run query
            var qRes = await global.helpers.triplestoreConnection.getQuery(projNo, query, 'application/ld+json');
            calcData = await _transformRes(qRes);
            calcData.calculationURI = calculationURI;
        }catch(e){
            console.log(e)
            next({msg: e.message, status: e.status});
        }

        // Re-append calculation and return 
        try{
            if(materialize){

                // Count number of results
                calcData.queryType = 'count';
                query = opmCalc.putCalc(calcData);
                process.env.DEBUG && console.log('---\n'+query);

                var count = await global.helpers.triplestoreConnection.getQuery(projNo, query);
                count = count.results.bindings[0].count.value;
                process.env.DEBUG && console.log('---\n'+count+' new results to insert');
                var msg = count == 0 ? 'There were no new calculation results to insert' : `successfully inserted ${count} calculation results.`;

                // Append
                if(count > 0){
                    calcData.queryType = 'insert';
                    query = opmCalc.putCalc(calcData);
                    process.env.DEBUG && console.log('---\n'+query);
                    await global.helpers.triplestoreConnection.updateQuery(projNo, query);
                }
                
                res.send({msg});
            }else{
                // Build query with OPM-QG
                calcData.queryType = 'construct';
                query = opmCalc.putCalc(calcData);
                process.env.DEBUG && console.log('---\n'+query);

                var inserted = await global.helpers.triplestoreConnection.getQuery(projNo, query, 'application/ld+json');
                res.send(inserted);
            }
        }catch(e){
            console.log(e)
            next({msg: e.message, status: e.status});
        }

    })

}