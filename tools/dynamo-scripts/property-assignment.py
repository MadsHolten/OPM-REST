instNS = 	IN[0]		# Namespace to be used for each resource (ex http://someArchitect/projA/)
propPFX = 	IN[1][0]	# Prefix for the property (ex 'props')
propNS = 	IN[1][1]	# Namespace for the property (ex 'https://w3id.org/props#')
prop = 		IN[2]		# Property to be assigned (ex 'props:area')
dtPFX = 	IN[3][0]	# Prefix for the datatype (ex 'xsd')
dtNS = 		IN[3][1]	# Namespace for the datatype (ex 'http://www.w3.org/2001/XMLSchema#')
dt = 		IN[4]		# Datatype (ex 'xsd:decimal')
elements = 	IN[5]		# List of all the elements
properties = IN[6]		# List of all the properties

# PREFIXES
str = "@prefix inst: <%s> .\n" % instNS
str+= "@prefix %s: <%s> .\n" % (propPFX, propNS)
str+= "@prefix %s: <%s> .\n\n" % (dtPFX, dtNS)

# INSTANCES
for i, e in enumerate(elements):
	str+= 'inst:%s %s "%s"^^%s .\n' % (e.UniqueId, prop, properties[i], dt)

OUT = str