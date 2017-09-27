var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = 3000;

var data = {}; // use object as database, at least for now
// due to limitations of object and not using proper DB,
// store for each key the history of values as arrays
// where each element in array is a version consisting of posted value and timestamp when the request was received

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res) {
  console.log('GET request to home');
  res.send('Response');
});

app.get('/object', function(req, res) {
  console.log('GET /object');
  res.json(data);
});

app.post('/object', function(req, res) {
  // assumption on behavior: a POST request is accepted only if it contains one key-value pair
  // although an extension to allow a POST request to upload multiple pairs could be possible, the response structure in current requirements is not compatible with such requests
  var keys = Object.keys(req.body);
  if (keys.length != 1) {
    console.log('POST /object - invalid number of keys');
    return res.json({error:'Invalid number of keys'});
  }

  var key = keys[0];
  var val = req.body[key];
  var timestamp = Math.floor((new Date()).getTime() / 1000);
  console.log ('POST /object - key:' + key + ', value:' + val + ' at time ' + timestamp);

  var version = {value:val, timestamp:timestamp};

  if (data[key]) {
    data[key].unshift(version);
  } else {
    data[key] = [version];
  }

  return res.json({key:key, value:val, timestamp:timestamp});
});

app.get('/object/:key', function(req, res) {
  var key = req.params.key;
  console.log('GET /object/' + key);

  var history = data[key];

  var out = {};
  var timestamp = req.query.timestamp;

  if (timestamp) {
    // find the earliest version that was added before (or at same time as) given timestamp
    // assumption: if timestamp is before earliest version, return empty object since the key did not exist in DB at that time
    // assumption: if timestamp is after latest version, return latest value since it will be the value at given timestamp unless the value is updated before that
    var version = history.find(function(ver) {
      return (ver.timestamp <= timestamp);
    });
    if (version) out = {value: version.value};
  } else {
    out = {value:history[0].value};
  }

  res.json(out);
});

app.listen(port, function() {
  console.log('Version Control listening on port ' + port);
});
