module.exports = (app) => {

    // DESCRIBE RESOURCE
    app.get('/:projNo/update', async (req, res, next) => {

        // Get URL params
        const projNo = req.params.projNo;

        // Get query params
        const query = req.query.query;

        try{
            var qRes = await global.helpers.triplestoreConnection.updateQuery(projNo, query);
            res.send(qRes);
        }catch(e){
            next({msg: e.message, status: e.status});
        }

    })

}