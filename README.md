# Hbase

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