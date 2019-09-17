module.exports = (app) => {

    // PING API
    app.get('/ping', async (req, res, next) => {

        res.send(true);

    })

}