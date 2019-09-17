## DEMO APP
An app demonstrating client communication with an AEC Knowledge Graph through OPM-REST can be accessed [here](https://madsholten.github.io/OPM-REST/demonstration-app/dist/demonstration-app/)


## INSTALL WITH DOCKER

Steps to run the OPM-REST backend with [Docker Desktop](https://www.docker.com/products/docker-desktop):

1. run command `git clone https://github.com/MadsHolten/OPM-REST.git` in some local directory to clone OPM-REST
2. run command `cd OPM-REST` to enter the directory
3. run command `docker-compose build`
4. run command `docker-compose up`


## SETTINGS

It is recommended that you change the Fuseki username and password. Do so by first changing the *shiro.ini* file in the root of the repository:

```
# CHANGE THIS LINE
admin=admin

# TO YOUR PERSONAL PREFERENCE
{user}={pass}
```

After changing it in *shiro.ini* you also need to change the environment variables used in *docker-compose.yml*:

```
# CHANGE THESE LINES
      - FUSEKI_USER=admin
      - FUSEKI_PASS=admin

# TO YOUR PERSONAL PREFERENCE
      - FUSEKI_USER={user}
      - FUSEKI_PASS={pass}
```

## USE

1. Create a new dataset in Fuseki called `duplex`
2. Load the Knowledge Graph of a duplex house in `./app/static/Duplex.ttl`
3. Check everything is fine by issuing a HTTP GET request at `http://localhost:3000/duplex/arch/rooms`


## ROUTES
The five batch upload routes *class-assignment*, *property-assignment*, *class-create*, *relationship-assignment* and *class-property-assignment* are described in detail in the [documentation folder](https://github.com/MadsHolten/OPM-REST/tree/master/documentation/opm-upload).


## TOOLS

The repository also contains a set of Dynamo Scripts for exporting data from Autodesk Revit. See [this folder](https://github.com/MadsHolten/OPM-REST/tree/master/tools/dynamo-scripts) which also contains documentation for each script and how it works with OPM-REST.


## OPM in the literature
*Mads Holten Rasmussen, Maxime Lefrançois, Mathias Bonduel, Christian Anker Hviid and Jan Karlshøj (2018)* **OPM: An ontology for describing properties that evolve over time**, *Proceedings of the 6th Linked Data in Architecture and Construction Workshop, CEUR, June 19-21, 2018, London, United Kingdom, [http://ceur-ws.org/Vol-2159/03paper.pdf](http://ceur-ws.org/Vol-2159/03paper.pdf)*

*Mads Holten Rasmussen, Maxime Lefrançois, Pieter Pauwels, Christian Anker Hviid and Jan Karlshøj (in press)* **Managing interrelated project information in AEC Knowledge Graphs**, *Automation in Construction*