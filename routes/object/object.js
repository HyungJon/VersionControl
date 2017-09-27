var express = require('express');
var bodyParser = require('body-parser');

var router = express.Router();
var port = 3000;

var database = require('../../database/database');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:true}));

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
    var queryKeys = Object.keys(req.query);

    // handle invalid query
    if (queryKeys.length > 1 || (queryKeys.length === 1 && queryKeys[0] !== 'timestamp')) {
      console.log('GET /object/' + key + ' - invalid query');
      return res.status(400).json({error:'Invalid query'});
    }

    if (timestamp) {
      console.log('GET /object/' + key + '?timestamp=' + timestamp);
      database.getLatestBeforeTimestamp(key, timestamp, function(err, val) {
        if (err) return res.status(404).json(err);
        return res.status(200).json({value:val});
      });
    } else {
      console.log('GET /object/' + key);
      database.getLatest(key, function(err, val) {
        if (err) return res.status(404).json(err);
        return res.status(200).json({value:val});
      });
    }
  });

module.exports = router;
