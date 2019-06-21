## INSTALL

Steps to run the OPM-REST backend:

1. install [NodeJS](https://nodejs.org/en/)
2. Clone repository
3. run command `npm install` in the repository
4. deploy a SPARQL 1.1 Protocol server, for example deploying (Fuseki as a Docker container)[https://hub.docker.com/r/stain/jena-fuseki/]
5. check `config.json` and edit if using according to your SPARQL 1.1 Protocol server
6. run command `npm start` to start OPM-REST (should run on port 3000)

## USE

1. Create a new dataset in Fuseki called `duplex`
2. Load the Knowledge Graph of a duplex house in `./app/static/Duplex.ttl`
3. Check everything is fine by issuing a HTTP GET request at `http://localhost:3000/duplex/arch/rooms`
