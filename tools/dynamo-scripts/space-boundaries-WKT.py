import clr
clr.AddReference('ProtoGeometry')
from Autodesk.DesignScript.Geometry import *
#The inputs to this node will be stored as a list in the IN variables.
rooms = IN[0]

def linesToWKT(lines):
	wkt = "POLYGON(("
	length = len(lines)
	
	for i,line in enumerate(lines):
		sp = line.StartPoint
		ep = line.EndPoint
		if i == 0 or isEnd:
			# Save startpoint as the polygon starting point
			polyStart = "%s %s" % (str(sp.X), str(sp.Y))
			wkt+= "%s %s, " % (str(sp.X), str(sp.Y))

			
		# Append line endpoint	
		wkt+= "%s %s" % (str(ep.X), str(ep.Y))
		
		# If the endpoint meets the start point, the sub-polygon ends
		isEnd = polyStart == "%s %s" % (str(ep.X), str(ep.Y))
		if isEnd and not i == length-1:
			wkt+= "), ("
		# If last line in list, the whole polygon ends
		elif i == length-1:
			wkt+= "))"
		# If none of above, a new polygon point will come
		else:
			wkt+= ", "
			
	return wkt

polygons = []

for lines in rooms:
	wkt = linesToWKT(lines)
	polygons.append(wkt)

#Assign your output to the OUT variable.
OUT = polygons