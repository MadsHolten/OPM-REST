const express = require('express');
const bodyParser = require('body-parser');     // To parse HTTP body element
const app = express();
const fuseki = require('./helpers/fuseki-connection')

// MIDDLEWARE
app.use(bodyParser.json()); // Parse JSON

// ROUTES
require('./routes/project-number/discipline/opm-upload').classAssignment(app)
require('./routes/project-number/discipline/type').rooms(app)
require('./routes/project-number/discipline/type').init(app)

//Handle errors
app.use((err, req, res, next) => {
    if(err){
        const msg = err.msg ? err.msg : "Something went wrong";
        const status = err.status ? err.status : 500;
        res.status(status).send({error: msg});
    }
});

module.exports = app;