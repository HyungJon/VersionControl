var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();
var port = 3000;

var database = require('../../database/database');
// var data = {}; // use object as database, at least for now
// due to limitations of object and not using proper DB,
// store for each key the history of values as arrays
// where each element in array is a version consisting of posted value and timestamp when the request was received

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

// TODO: add status to response

router.route('/')
  .get(function(req, res) {
    console.log('GET /object');
    res.status(202).json(database.getData());
  })

  .post(function(req, res) {
    // assumption: a POST request is accepted only if it contains one key-value pair
    // extending to allow one POST request to contain multiple pairs is possible, but may not be compatible with response structure as specified in requirements
    var keys = Object.keys(req.body);
    if (!keys || keys.length != 1) {
      console.log('Post /object - invalid input');
      return res.status(400).json({error:'Invalid input'});
    }

    var key = keys[0];
    var val = req.body[key];
    var timestamp = Math.floor((new Date()).getTime() / 1000);
    console.log('POST /object - {key:' + key + ', value:' + val + '} at timestamp ' + timestamp);

    database.insert(key, val, timestamp);
    return res.status(200).json({key:key, value:val, timestamp:timestamp});
  });

router.route('/:key')
  .get(function(req, res) {
    var key = req.params.key;
    var out = {}
    var timestamp = req.query.timestamp;

    // handle invalid query
    if (Object.keys(req.query).length > 1 || (Object.keys(req.query)[0] !== timestamp)) {
      console.log('GET /object/' + key + ' - invalid query');
      return res.status(400).json({error:'Invalid query'});
    }

    // if key not in database, return error
    if (!database.containsKey(key)) {
      console.log('GET /object/' + key + ' - key not found');
      return res.status(404).json({error:'Key not found'});
    }

    if (timestamp) {
      // find the earliest version that was added before (or at same time as) given timestamp
      // assumption: if timestamp is before earliest version, return empty object since the key did not exist in DB at that time
      // assumption: if timestamp is after latest version, return latest value since it will be the value at given timestamp unless the value is updated before that
      console.log('GET /object/' + key + '?timestamp=' + timestamp);
      var val = database.getBeforeTimestamp(key, timestamp);
      if (val) out = {value:val};

    } else {
      console.log('GET /object/' + key);
      out = {value:database.getLatest(key)};
    }

    return res.status(200).json(out);
  });

module.exports = router;
