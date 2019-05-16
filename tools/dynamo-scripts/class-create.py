#The inputs to this node will be stored as a list in the IN variables.
classNS = 		IN[0]
superClassPFX = IN[1][0]
superClassNS = 	IN[1][1]
superClass = 	IN[2]
classes =		IN[3]

# PREFIXES
str = "@prefix inst: <%s> .\n" % classNS
str+= "@prefix owl: <http://www.w3.org/2002/07/owl#> .\n"
str+= "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n"
str+= "@prefix %s: <%s> .\n\n" % (superClassPFX, superClassNS)

# INSTANCES
for c in classes:
	str+= "inst:%s a owl:Class ;\n" % (c.UniqueId)
	str+= "\trdfs:subClassOf %s .\n" % (superClass)

OUT = str