# `io-hbase`

REST API client for HBase.

## Installing Dependencies
```
$ npm install io-hbase
```

## Creating Instance
**ES5**
```javascript
var Hbase = require('io-hbase');
var hbaseClient = Hbase.createClient({
    host: 'localhost',
    port: 8080
});
```
**ES6 or above**
```javascript
import * as Hbase from 'io-hbase';

const hbaseClient = Hbase.createClient({
   host: 'localhost',
   port: 8080
})
```

## Launch HBase using docker

* https://github.com/dajobe/hbase-docker
* RestAPI Endpoint
  - localhost:8080

```bash
$ docker run -d \
  -p 16010:16010 \
  -p 9095:9095 \
  -p 8080:8080 \
  -p 8085:8085 \
  dajobe/hbase 
```

## Reference for Filter

* https://gist.github.com/stelcheck/3979381
* https://www.oreilly.com/library/view/hbase-the-definitive/9781449314682/ch04.html