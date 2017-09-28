# Version controlled key-value storage with HTTP API

## Supported API

* POST /object
    * Uploads to database a key-value pair as JSON
       * {mykey:'value1'}
    * Response contains 
       * {key:'mykey', value:'value1', timestamp:1506564879}
* GET /object/key
    * Retrieves from database the value for key
       * {value:value1}
* GET /object/key?timestamp=x
    * Retrieves from database the value for key at timestamp x
       * {value:value2}
    * If x is before first stored version for key, returns null
       * {value:null}
    * If x is after latest stored version for key, returns latest value
       * {value:value3}

## Notes
* Uses JSON as database
