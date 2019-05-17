instNS =		IN[0]	# Namespace to be used for each space (ex http://someArchitect/projA/)
adjacencies = 	IN[1]	# List of adjacencies

# PREFIXES
str = "@prefix inst: <%s> .\n" % instNS
str+= "@prefix bot: <https://w3id.org/bot#> .\n\n"

for adjSpaces in adjacencies:
	guidA = adjSpaces[0].UniqueId
	
	adjSet = set()
	for space in adjSpaces:
		if space != adjSpaces[0] and space not in adjSet:
			guidB = space.UniqueId
			
			str+= 'inst:%s bot:adjacentZone inst:%s .\n' % (guidA, guidB)
			adjSet.add(space)

#Assign your output to the OUT variable.
OUT = str