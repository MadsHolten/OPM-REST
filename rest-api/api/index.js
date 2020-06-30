const express = require('express');
const bodyParser = require('body-parser');     // To parse HTTP body element
const cors = require('cors');                  // To allow Cross Origin requests
const app = express();
const compression = require('compression');

// GLOBALS
global.helpers = require('./helpers')
global.config = require('../config.json')

// MIDDLEWARE
app.use(compression());
app.use(bodyParser({limit: '500mb'}));
app.use(bodyParser.json({ limit: '500mb', type: 'application/*+json' }));           // Parse JSON
app.use(bodyParser.text({ limit: '500mb', type: 'text/turtle' }));  // Parse turtle
app.use(cors());

// ROUTES

/**
 * PING
 * 
 * GET      /ping           Returns true if the API is online
 */
require('./routes/ping').init(app);

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
 * GET      /:projNo/:discipline/calculations               // All calculations
 * GET      /:projNo/:discipline/calculations/outdated      // List outdated calculation results
 * GET      /:projNo/:discipline/calculations/tree          // List all calculations in the order that they are dependent on each other
 * POST     /:projNo/:discipline/calculations               // Create calculation
 * GET      /:projNo/:discipline/calculations/:id           // Calculation data for specific calculation
 * POST     /:projNo/:discipline/calculations/:id           // Append in all situations where path is matched and no existing result
 * PUT      /:projNo/:discipline/calculations/:id           // Re-append in all situations where path is match and existing result is outdated
 * 
 */
require('./routes/project-number/discipline/calculations').tree(app);
require('./routes/project-number/discipline/calculations').postCalc(app);
require('./routes/project-number/discipline/calculations').putCalc(app);
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