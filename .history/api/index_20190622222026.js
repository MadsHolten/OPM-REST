const express = require('express');
const bodyParser = require('body-parser');     // To parse HTTP body element
const cors = require('cors');                    // To allow Cross Origin requests
const app = express();

// MIDDLEWARE
app.use(bodyParser({limit: '500mb'}));
app.use(bodyParser.json({ type: 'application/*+json' }));   // Parse JSON
app.use(bodyParser.text({ type: 'text/turtle' }));          // Parse turtle
app.use(cors());

// ROUTES

/**
 * SPARQL routes
 * 
 * These basically mimic the Fuseki endpoints but add a layer where authentication can be handled
 * 
 * GET      /:projNo/query
 * GET      /:projNo/update
 * 
 */
require('./routes/project-number/query').init(app);
require('./routes/project-number/update').init(app);

/**
 * OPM-upload routes
 * 
 * POST     /:projNo/opm-upload/class-assignment
 * POST     /:projNo/opm-upload/class-create
 * POST     /:projNo/opm-upload/property-assignment
 * POST     /:projNo/opm-upload/relationship-assignment
 * POST     /:projNo/opm-upload/class-property-assignment
 * 
 */
require('./routes/project-number/opm-upload').classAssignment(app);
require('./routes/project-number/opm-upload').classCreate(app);
require('./routes/project-number/opm-upload').propertyAssignment(app);
require('./routes/project-number/opm-upload').relationshipAssignment(app);
require('./routes/project-number/opm-upload').classPropertyAssignment(app);

/**
 * OPM PROPERTY routes
 * 
 * GET      /:projNo/:discipline/properties
 * 
 */
require('./routes/project-number/discipline/properties').init(app);

/**
 * OPM CALCULATION routes
 * 
 * GET      /:projNo/:discipline/calculations
 * POST     /:projNo/:discipline/calculations
 * POST     /:projNo/:discipline/calculations/:id
 * PUT      /:projNo/:discipline/calculations/:id
 * 
 */
require('./routes/project-number/discipline/calculations').init(app);

/**
 * Resource type routes
 * 
 * GET      /:projNo/:discipline/:type          Returns all instances of the given type (uses typeMappings in config.json)
 * POST     /:projNo/:discipline/:type          Creates a new instance of the given type and returns the URI of the new resource (uses typeMappings in config.json)
 * GET      /:projNo/:discipline/:type/:id      Returns a specific element and its relationships to other elements
 * 
 */
require('./routes/project-number/discipline/type').init(app);




//Handle errors
app.use((err, req, res, next) => {
    if(err){
        const msg = err.msg ? err.msg : "Something went wrong";
        const status = err.status ? err.status : 500;
        res.status(status).send({errors: msg});
    }
});

module.exports = app;