instNS = 	IN[0]		# Namespace to be used for each class instance (ex http://someArchitect/projA/)
clPFX = 	IN[1][0]	# Prefix for the class (ex 'bot')
clNS = 		IN[1][1]	# Namespace for the class (ex 'https://w3id.org/bot#')
cl = 		IN[2]		# Class to be assigned (ex 'bot:Space')
elements = 	IN[3]		# List of all the elements

# PREFIXES
str = "@prefix inst: <%s> .\n" % instNS
str+= "@prefix %s: <%s> .\n\n" % (clPFX, clNS)

# INSTANCES
for e in elements:
	str+= "inst:%s a %s .\n" % (e.UniqueId, cl)

OUT = str