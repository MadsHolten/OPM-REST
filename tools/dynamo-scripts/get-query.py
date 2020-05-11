import clr
import sys
sys.path.append('C:\Program Files (x86)\IronPython 2.7\Lib')
import httplib, urllib, base64, json

clr.AddReference('ProtoGeometry')
from Autodesk.DesignScript.Geometry import *
#The inputs to this node will be stored as a list in the IN variables.
endpoint = IN[0]
query = IN[1]
user = IN[2]
pw = IN[3]
go = IN[4]

if go:
	
	# DB CONNECTION
	url = endpoint.split('/')[0]
	rest = endpoint.split(url)[1]
	
	# Establish connection
	conn = httplib.HTTPConnection(url)
	
	# Authentication
	auth = base64.encodestring('%s:%s' % (user, pw)).replace('\n', '')
	
	# URL encode payload
	f = { 'query' : query}
	payload = urllib.urlencode(f)
	
	# Define headers for authorization etc.
	headers = {
		'Accept' : 'application/sparql-results+json',
		'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': 'Basic %s' % auth
	}
	
	data = payload
	
	conn.request("POST", rest, payload, headers)
	
	# Get response
	res = conn.getresponse()
	data = res.read()
	
	text = data.decode("utf-8")
	
	# Parse JSON and extract subjects
	dictionary = json.loads(text)
	
	bindings = dictionary['results']['bindings']
	
	subjects = []
	for item in bindings:
		subjects.append(item['s']['value'])
	
	# Close db connection
	conn.close()

else:
	data = 'off mode'
	
#Assign your output to the OUT variable.
OUT = text