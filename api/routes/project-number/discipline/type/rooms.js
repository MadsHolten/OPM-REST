const fuseki = require('../../../../helpers/fuseki-connection');
const uriGen = require('../../../../helpers/uri-create');

module.exports = (app) => {

    // DESCRIBE RESOURCE
    app.get('/:projNo/:discipline/rooms', async (req, res) => {

        // GET URI PARAMS
        const projectNumber = req.params.projNo;

        var q = `
                PREFIX bot: <https://w3id.org/bot#>
                CONSTRUCT{
                    ?subject ?pred ?obj
                }
                WHERE {
                    ?subject a bot:Space ;
                        ?pred ?obj
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