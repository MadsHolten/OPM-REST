import sys
sys.path.append(r'C:\Program Files (x86)\IronPython 2.7\Lib')
import urllib

#The inputs to this node will be stored as a list in the IN variables.
classNS = IN[0]
propPFX = IN[1][0]
propNS = IN[1][1]
prop = IN[2]
dtPFX = IN[3][0]
dtNS = IN[3][1]
dt = IN[4]
elements = IN[5]
properties = IN[6]

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
str+= "@prefix %s: <%s> .\n" % (propPFX, propNS)
str+= "@prefix %s: <%s> .\n\n" % (dtPFX, dtNS)

# INSTANCES
for i, e in enumerate(elements):
	classId = _get_id_name(e)
	str+= 'ont:%s %s "%s"^^%s .\n' % (classId, prop, properties[i], dt)

OUT = str