const fuseki = require('../../../../helpers/fuseki-connection');
const config = require('../../../../../config.json');
const OPMCalc = require('opm-qg').OPMCalc;
const urljoin = require('url-join');

module.exports = (app) => {

    // CALCULATE THE EXECUTION TREE
    app.get('/:projNo/:discipline/calculations/tree', async (req, res, next) => {

        config.DEBUG && console.log("Route: GET /:projNo/:discipline/calculations/tree");

        // Get URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const namespace = urljoin(config.dataNamespace, projNo, discipline);

        // Get all calculations
        try{
            // Build query wit OPM-QG
            // const opmCalc = new OPMCalc(namespace, config.prefixes);
            const q = _getAllCalculationsQuery();

            // Execute query
            var qRes = await fuseki.getQuery(projNo, q, 'application/ld+json');
            res.send(qRes);
            // res.send(q)
        }catch(e){
            next({msg: e.message, status: e.status});
        }
        

        // res.send("get tree")

        

        // const opmCalc = new OPMCalc(namespace, config.prefixes);
        // const q = opmCalc.getOutdated();
        // console.log(q);
        
        // try{
        //     var qRes = await fuseki.getQuery(projNo, q, 'application/ld+json');
        //     res.send(qRes);
        // }catch(e){
        //     next({msg: e.message, status: e.status});
        // }

    });
}

const _getAllCalculationsQuery = () => {

    return `CONSTRUCT {
        ?uri opm:inferredProperty ?inf ;
            opm:argumentPaths ?list .
        ?listRest rdf:first ?head ;
            rdf:rest ?tail .
        }
        WHERE {
            ?uri a opm:Calculation ;
                opm:inferredProperty ?inf ;
                opm:argumentPaths ?list .
            ?list rdf:rest* ?listRest .
            ?listRest rdf:first ?head ;
                rdf:rest ?tail .
        }`;

}