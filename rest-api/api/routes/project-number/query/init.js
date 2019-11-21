const fuseki = require('../../../helpers/fuseki-connection')

module.exports = (app) => {

    // Get query by GET method
    app.get('/:projNo/query', async (req, res, next) => {

        // Get URL params
        const projNo = req.params.projNo;

        // Get query params
        const query = req.query.query;
        var mimeType = req.query.mimeType ? req.query.mimeType : 'application/sparql-results+json';

        if(query.toLowerCase().indexOf('construct') != -1 && mimeType == 'application/sparql-results+json') mimeType = 'application/ld+json';

        try{
            var qRes = await fuseki.getQuery(projNo, query, mimeType);
            res.send(qRes);
        }catch(e){
            next({msg: e.message, status: e.status});
        }

    })

    // Get query by POST method
    api.post('/:projNo/query', async (req, res, next) => {
 
        // Get URL params
        const projNo = req.params.projNo;

        // Get query from body
        const query = req.body.query;

        // Get accept header
        const mimeType = req.headers.accept == 'application/ld+json' ? 'application/ld+json' : null;

        try{
            res.send(await fuseki.getQuery(projNo, query, mimeType));
        }catch(err){
            next({msg: err.message, status: err.status});
        }
    })

}