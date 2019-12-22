# js-iot-api

IOT data sever connected to TTN infrastructure serving data via http api.
Written in javascript => require [node.js and npm](https://nodejs.org/en/) to run.

## settings

Is done via following environment variables:

- TTN_APPS: JSON array of array with 2 items: 1st - app name, 2nd - app secret:
```
TTN_APPS=[["app1","ttn-account-v2.sdkfwokjfdsojfowwkjfwof"]]
```
- DATA_HOOK_URL: url that PUT request on a new data is send to
- DATABASE_URL: connection string (currently to postgre db)
- PORT: port to bind to


## test

Rename env.sample -> .env and edit it appropriately with your own values.
For testing purposes you can use sqlite DB byt setting:

```
DATABASE_URL=db.sqlite
```

Then run:

```
npm i
npm start
```

### Production deploy

Docker.io instance can be recomended for [Production deploy](https://github.com/modularni-urad/docker-settings).

## usage

Data can be queried via API that supports [loopback.io like where filter](https://loopback.io/doc/en/lb2/Where-filter).
The contition is a JSON specifying values for search, e.g. following sample:
```
FILTER='{"typ":"temp","app_id":"tabor_aplikace","dev_id":"ketcube_tabor","time":{">":"2019-11-20T16:32:52.200Z"}}'
URL="http://data.mutabor.cz:2300/data?filter=$FILTER"
wget -qO - $URL | json_pp
```
Queries temperature (temp) data from device called "ketcube_tabor" in "tabor_aplikace" that are older than 2019-11-20T16:32:52.200Z.

You can use fields param for specifying which fields you want to get.
E.g. only value,time:
```
URL="http://data.mutabor.cz:2300/data?filter=$FILTER&fields=value,time"
wget -qO - $URL | json_pp
```

## integrations

To TTN infrastructure you can connect different ways:
- [storage integration](https://www.thethingsnetwork.org/docs/applications/storage/api.html):
the data are stored in TTN storage __only for 7days__ -> regular download is performed: see [ttn/storage_integration.js](ttn/storage_integration.js).
- MQTT client through [ttn api usage](https://www.thethingsnetwork.org/docs/applications/nodejs/quick-start.html), see [ttn/mqtt_client.js](ttn/mqtt_client.js).
In case you are behind a firewall (FW), you have to find you which ports to open.
The connection is made via gRPC.
- [HTTP integration](https://www.thethingsnetwork.org/docs/applications/http/):
It needs to add another POST route to API and let TTN call this endpoint.
FW issues detected so moved to storage integration.


## DB

[DB model](./migrations/) is as simple as possible.
It reflects fact, that each sensor sends periodically a value of a type.
In TTN sensor is identified by app_id and dev_id, so the DB schema is following:
- app_id: string
- dev_id: string
- typ: string
- value: float
- time: timestamp

Each message of each device can be split into particular values of different type with [Payload Format](https://www.youtube.com/watch?v=nT2FnwCoP7w).
Each device type must provide format of payload in documentation.
