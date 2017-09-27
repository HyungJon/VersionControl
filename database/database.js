// database module

// object is used as database for this 
// due to limitations of using JSON, store for each key the history of values as arrays where each element in array is a version information, containing value and timestamp when the POST request was received

// can later be extended to support a peroper database rather than JSON

// due to limitations of object and not using proper DB,
// store for each key the history of values as arrays
// where each element in array is a version consisting of posted value and timestamp when the request was received

function Database() {
  this.data = {};

  this.insert = function(key, val, timestamp) {
    var version = {key:key, value:val, timestamp:timestamp};
    if (this.data[key]) {
      this.data[key].unshift(version);
    } else {
      this.data[key] = [version];
    }
  };

  this.getData = function() {
    return this.data;
  };

  this.containsKey = function(key) {
    return (this.data[key] != null);
  };

  this.getLatest = function(key, callback) {
    if (!this.data[key]) {
      return callback({error:"Key not found"});
    } else {
      return callback(null, this.data[key][0].value);
    }
  };

  // find the latest version that was added before or at given timestamp
  // assumption: if given timestamp is before earliest version, return empty object since the key did not exist in DB at that time
  // assumption: if given timestamp is after latest version, return latest value since it will be the value at given timestamp as long as the value is not updated before that
  this.getLatestBeforeTimestamp = function(key, timestamp, callback) {
    if (!this.data[key]) return callback({error:"Key not found"});
    var version = this.data[key].find(function(ver) {
      return (ver.timestamp <= timestamp);
    });

    if (!version) return callback(null, null);
    return callback(null, version.value);
  };
}

module.exports = new Database();
