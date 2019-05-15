const fuseki = require('../../../../helpers/fuseki-connection');
const uriGen = require('../../../../helpers/uri-create');

module.exports = (app) => {

    // DESCRIBE RESOURCE
    app.get('/:projNo/:discipline/:type/:id', async (req, res) => {

        // GET URI PARAMS
        const projectNumber = req.params.projNo;
        const discipline = req.params.discipline;
        const type = req.params.type;
        const id = req.params.id;

        var URI = uriGen(projectNumber, discipline, type, id);

        var q = `
                PREFIX opm: <https://w3id.org/opm#>
                CONSTRUCT{
                    ?subject ?pred ?obj
                }
                WHERE {
                    BIND(<${URI}> AS ?subject)
                    ?subject ?pred ?obj
                }`;

        try{
            var qRes = await fuseki.getQuery(projectNumber,q,"application/ld+json");
            res.send(qRes);
        }
        catch(err){
            console.log(err)
            next({msg: err, status: 500});
        }

    });

}