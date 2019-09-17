const app = require('./api')
const port = process.env.PORT || 3000

// LISTEN ON PORT
app.listen(port, () => console.log(`OPM REST API listening on port ${port}!`))