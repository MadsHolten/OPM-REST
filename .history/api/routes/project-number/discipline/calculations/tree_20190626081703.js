const fuseki = require('../../../../helpers/fuseki-connection');
const config = require('../../../../../config.json');
const OPMCalc = require('opm-qg').OPMCalc;
const urljoin = require('url-join');
const jsonld = require('jsonld');

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
            var data = await fuseki.getQuery(projNo, q, 'application/ld+json');
        }catch(e){
            next({msg: e.message, status: e.status});
        }

        const context = {
            "@context": {
                "@vocab": "https://w3id.org/opm#",
                "uri": "@id",
                "paths": {"@id": "argumentPaths", "@container": "@list"},
                "inferred": {"@id": "inferredProperty", "@type": "@id"}
            }
        };
    
        data = await jsonld.compact(data, context);

        if(data['@graph'].length == 0) throw new Error(`No calculations defined`, 200);

        var base = data['@graph'].map(x => {

            var dependencies = x.paths.map(p => {
                var subElements = p.toString().split(" ");
                var predicates = subElements.map(e => util.appendContext(e)).filter(url => url.indexOf("http") != -1);
                return predicates;
            });
    
            return {uri: x.uri, dependencies: dependencies[0], inferred: x.inferred};
        });

        res.send(base);
        

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