const fuseki = require('../../../../helpers/fuseki-connection');
const uriGen = require('../../../../helpers/uri-create');
const config = require('../../../../../config.json');

module.exports = (app) => {

    // GET ALL INSTANCES OF A TYPE
    app.get('/:projNo/:discipline/:elementType', async (req, res, next) => {

        config.DEBUG && console.log("Route: GET /:projNo/:discipline/:elementType");
    
        // GET URI PARAMS
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const elementType = req.params.elementType;
    
        var match = config.typeMappings.find(item => item.category == elementType);
        if(!match){
            next({msg: "No match for the specified element type", status: 400})
        }else{
            var classes = match.types.filter(type => type != 'bot:Element').join(' ');

            var q = `
            CONSTRUCT{
                ?s a ?class ;
                    ?p ?o
            }
            WHERE{
                VALUES ?class { ${classes} }
                ?s a ?class ;
                    ?p ?o
            }`;

            q = util.appendPrefixesToQuery(q);
            
            try{
                var qRes = await fuseki.getQuery(projNo,q,'application/ld+json');
                res.send(qRes);
            }catch(e){
                console.log(err)
                next({msg: e, status: 500})
            }
        }
    
    });

    // DESCRIBE RESOURCE
    app.get('/:projNo/:discipline/:elementType/:id', async (req, res) => {

        config.DEBUG && console.log("Route: GET /:projNo/:discipline/:elementType/:id");

        // GET URI PARAMS
        const projectNumber = req.params.projNo;
        const discipline = req.params.discipline;
        const elementType = req.params.elementType;
        const id = req.params.id;

        var URI = uriGen(projectNumber, discipline, elementType, id);

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

    // ADD RESOURCE OF SPECIFIC KIND
    app.post('/:projNo/:discipline/:elementType', async (req, res, next) => {

        config.DEBUG && console.log("Route: POST /:projNo/:discipline/:elementType");

        // GET URI PARAMS
        const projNo = req.params.projNo;
        const discipline = req.params.discipline;
        const elementType = req.params.elementType;

        const URI = urljoin(process.env.DATA_NAMESPACE, projNo, discipline, elementType, uuidv4());
    
        // First check if there is a match in the type mappings list
        var tmMatch = config.typeMappings.find(item => item.category == elementType);
        if(tmMatch){
            var classes = tmMatch.types.join(' ');
    
            var q = `
            INSERT{
                <${URI}> a ?class ;
                    prov:generatedAtTime ?now
            }
            WHERE{
                VALUES ?class { ${classes} }
                BIND(NOW() AS ?now)
            }`;
    
            q = util.appendPrefixesToQuery(q);
            
            try{
                await fuseki.updateQuery(projNo,q);
                res.send({msg: `created new resource with URI ${URI}`, URI});
            }catch(e){
                next({msg: e, status: 500})
            }
        }else{
            next({msg: "No match", status: 400})
        }
        next();
    
        // Send HTML if header is set to HTML
        res.send(URI);
    });

}