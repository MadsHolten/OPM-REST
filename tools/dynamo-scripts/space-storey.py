#The inputs to this node will be stored as a list in the IN variables.
spaceNS = 	IN[0]	# Namespace to be used for each space (ex http://someArchitect/projA/spaces/)
storeyNS = 	IN[1]	# Namespace to be used for each storey (ex http://someArchitect/projA/levels/)
spaces = 	IN[2]	# List of spaces
storeys = 	IN[3]	# List of storeys

# PREFIXES
str = "@prefix bot: <https://w3id.org/bot#> .\n"
str+= "@prefix sp: <%s> .\n" % spaceNS
str+= "@prefix st: <%s> .\n\n" % storeyNS

# INSTANCES
for i, storey in enumerate(storeys):
	space = spaces[i]
	str+= 'st:%s bot:hasSpace sp:%s .\n' % (storey.UniqueId, space.UniqueId)

OUT = str