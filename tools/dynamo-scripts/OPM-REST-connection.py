import sys
sys.path.append('C:\Program Files (x86)\IronPython 2.7\Lib')
import httplib, urllib

# The inputs to this node will be stored as a list in the IN variables.
url = IN[0]
triples = IN[1]

first_slash = url.find('/')
host = url[:first_slash]
route = url[first_slash:]

conn = httplib.HTTPConnection(host)

# Define headers
headers = {"Content-type": "text/turtle", "Accept": "text/plain"}

# Send request
conn.request('POST', route, triples, headers)

# Get response
response = conn.getresponse()

# Read response
data = response.read()

# Close db connection
conn.close()

# Assign your output to the OUT variable.
OUT = data