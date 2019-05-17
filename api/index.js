const express = require('express');
const bodyParser = require('body-parser');     // To parse HTTP body element
const app = express();
const fuseki = require('./helpers/fuseki-connection')

// MIDDLEWARE
app.use(bodyParser.json()); // Parse JSON

// ROUTES

/**
 * OPM-upload routes
 * 
 * POST     /:projNo/opm-upload/class-assignment
 * POST     /:projNo/opm-upload/class-create
 * POST     /:projNo/opm-upload/property-assignment
 * POST     /:projNo/opm-upload/relationship-assignment
 * POST     /:projNo/opm-upload/class-property-assignment
 */
require('./routes/project-number/opm-upload').classAssignment(app)
require('./routes/project-number/opm-upload').classCreate(app)
require('./routes/project-number/opm-upload').propertyAssignment(app)
require('./routes/project-number/opm-upload').relationshipAssignment(app)
require('./routes/project-number/opm-upload').classPropertyAssignment(app)

/**
 * Resource type routes
 * 
 * GET      /:projNo/:discipline/:type/:id      Returns a specific element and its relationships to other elements
 * GET      /:projNo/:discipline/rooms          Returns all instances of bot:Space
 */
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