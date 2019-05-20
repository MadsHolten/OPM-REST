## INSTALL

1. Clone repository
2. run command `npm install`
3. install Jena Fuseki and run it on port 3030
4. check `config.json` and edit if using another triplestore endpoint
5. run OPM-REST with command `npm start`

## USE

1. Create a new dataset in Fuseki called `duplex`
2. Load Duplex house in (./app/static/Duplex.ttl)
3. Use cURL or Postman to check that you recieve some data on `{HOST}/duplex/arch/rooms` (`http://localhost:3000/duplex/arch/rooms`)
