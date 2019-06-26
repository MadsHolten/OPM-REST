const fuseki = require('../../../../helpers/fuseki-connection');
const ldt = require('../../../../helpers/ld-tools');
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
                var predicates = subElements.map(e => ldt.appendContext(e)).filter(url => url.indexOf("http") != -1);
                return predicates;
            });
    
            return {uri: x.uri, dependencies: dependencies[0], inferred: x.inferred};
        });

        // The tree array will contain the final tree
        var tree = [];

        // All the properties that are to be inferred by calculations are put in the unknown array
        var unknown = base.map(b => b.inferred);

        var counter = 0;
        var getIndex = (items) => {

            // Loop over items
            var itemsClone = items.slice(0);
            for(item of itemsClone){
                // Check if any of the dependencies are in the list of unknown
                var passedTest = true;
                var parents = [];
                for(dep of item.dependencies){
                    if(unknown.indexOf(dep) != -1) passedTest = false;
                    var parent = tree.filter(t => t.inferred == dep).map(t => t.uri)[0];
                    if(parent) parents.push(parent);
                }

                // If it passed the test, the calculation goes in the tree
                if(passedTest == true){
                    // Remove from base array
                    var idx = base.indexOf(item);
                    base.splice(idx,1);

                    if(parents.length > 0){
                        item.parents = parents;
                    }

                    // Set index value to the value of the counter and push it to the tree
                    item.depth = counter;
                    tree.push(item);
                }
            }

            // Remove the newly inferred properties to the unknown
            tree.forEach(x => {
                if(x.depth == counter){
                    var index = unknown.indexOf(x.inferred);
                    unknown.splice(index,1);
                }
            });

            // Run again if there are still items in the base
            counter ++
            if(unknown.length > 0 && counter < 20){
                getIndex(base);
            }
        }

        getIndex(base);

        res.send(tree);
        

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