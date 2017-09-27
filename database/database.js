// database module

// object is used as database for this 
// due to limitations of using JSON, store for each key the history of values as arrays where each element in array is a version information, containing value and timestamp when the POST request was received

// can later be extended to support a peroper database rather than JSON

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

  this.getLatest = function(key) {
    return this.data[key][0].value;
  };

  this.getBeforeTimestamp = function(key, timestamp) {
    var version = this.data[key].find(function(ver) {
      return (ver.timestamp <= timestamp);
    });
    if (version) return version.value;
    return null; // TODO: look for a better way to handle this part, possibly using callback
  };
}

module.exports = new Database();
