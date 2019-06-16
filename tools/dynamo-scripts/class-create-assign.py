import sys
sys.path.append(r'C:\Program Files (x86)\IronPython 2.7\Lib')
import urllib

#The inputs to this node will be stored as a list in the IN variables.
classNS = 	IN[0]
elementNS = IN[1]
elements = 	IN[2]
classes =	IN[3]

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
str = "@prefix el: <%s> .\n" % elementNS
str+= "@prefix ont: <%s> .\n\n" % classNS

# INSTANCES
for i, e in enumerate(elements):
	cl = classes[i]
	classId = _get_id_name(cl)
	str+= "el:%s a ont:%s .\n" % (e.UniqueId, classId)

OUT = str