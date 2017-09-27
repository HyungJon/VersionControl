var express = require('express');

var app = express();
var port = 3000;

var data = {}; // use object as database, at least for now

app.get('/', function(req, res) {
  console.log('GET request to home');
  res.send('Response');
});

app.listen(port, function() {
  console.log('Version Control listening on port ' + port);
});
