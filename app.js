var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;

var routerObject = require('./routes/object/object');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// handle requests to main
app.get('/', function(req, res) {
  console.log('GET request to home');
  res.status(200).send('Kim Hyung Jon\'s Version Controller application');
});

// assign router to /object
app.use('/object', routerObject);

app.listen(port, function() {
  console.log('Version Control listening on port ' + port);
});

// could be used for testing with mocha and chai
module.exports = app;
