
module.exports = (app) => {

    // CALCULATE THE EXECUTION TREE
    app.get('/:projNo/:discipline/calculations/tree', async (req, res, next) => {

        config.DEBUG && console.log("Route: GET /:projNo/:discipline/calculations/tree");

        // Get URL params
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const namespace = urljoin(config.dataNamespace, projNo, discipline);

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
}