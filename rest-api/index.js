const app = require('./api');
const port = process.env.PORT || 3000;

// LISTEN ON PORT
const server = app.listen(port, () => console.log(`OPM REST API listening on port ${port}!`));

// Increase timeout
server.setTimeout(120 * 60 * 1000); // 120 * 60 seconds * 1000 msecs = 120 minutes (2 hours);