spaceNS =		IN[0]	# Namespace to be used for space (ex http://someArchitect/projA/spaces/)
elementNS =		IN[1]	# Namespace to be used for element (ex http://someArchitect/projA/doors/)
adjacencies = 	IN[2]	# List of adjacencies

# PREFIXES
str = "@prefix sp: <%s> .\n" % spaceNS
str+= "@prefix el: <%s> .\n" % elementNS
str+= "@prefix bot: <https://w3id.org/bot#> .\n\n"

for spaces in adjacencies:
	spaceGUID = spaces[0].UniqueId
	
	adjSet = set()
	for adjElement in spaces:
		if adjElement != spaces[0] and adjElement not in adjSet:
			elementGUID = adjElement.UniqueId
			
			str+= 'sp:%s bot:adjacentElement el:%s .\n' % (spaceGUID, elementGUID)
			adjSet.add(adjElement)

#Assign your output to the OUT variable.
OUT = str