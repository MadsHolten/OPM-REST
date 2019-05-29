import sys
sys.path.append(r'C:\Program Files (x86)\IronPython 2.7\Lib')
import urllib

#The inputs to this node will be stored as a list in the IN variables.
classNS = 		IN[0]
superClassPFX = IN[1][0]
superClassNS = 	IN[1][1]
superClass = 	IN[2]
classes =		IN[3]

def _get_id_name(e):
	# Make lowercase and replace æ, ø, å
	n = e.Name.lower()
	n = n.replace('æ', 'ae').replace('ø', 'oe').replace('å', 'aa')
	# Make PascalCaseName
	n = ''.join(x for x in n.title() if x.isalnum())
	# URL encode
	n = urllib.quote(n)
	return n

# PREFIXES
str = "@prefix ont: <%s> .\n" % classNS
str+= "@prefix owl: <http://www.w3.org/2002/07/owl#> .\n"
str+= "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n"
str+= "@prefix %s: <%s> .\n\n" % (superClassPFX, superClassNS)

# INSTANCES
seen = set()
err = False
for c in classes:
	# Make PascalCaseName
	n = _get_id_name(c)
	if n in seen:
		err = True
	seen=seen | set([n])
	
	str+= "ont:%s a owl:Class ;\n" % (n)
	str+= "\trdfs:subClassOf %s .\n" % (superClass)
if not err:
	OUT = str
else:
	OUT = "Duplicate class names were discovered"