# demo redis
Example of local development with redis


## setup
Start a docker container with redis

    $ docker pull redis
    $ docker run --name redis -p 7379:6379 -d redis
    $ docker ps # should show the redis process

Docker run explanation:

    $ docker run --name <process name> -p[port] <exposedPort>:<internal port> -d[detach] <container name>

Redis commander is a helpful gui app

    $ npm i -g redis-commander
    $ redis-commander --redis-port 7379


## example
```js
var redis = require('redis')
var request = require('request')

var client = redis.createClient(7379)
client.on('connect', function () {
    console.time('redis')
    console.log('connected to redis')

    fetchFromApi(function (err, res) {
        if (err) throw err

        insertRedis(client, res.bpi, function (err, res) {
            if (err) throw err
            console.log('Insert success', res)
            getRange(client)
        })
    })
})

function fetchFromApi (cb) {
    var URL = 'https://api.coindesk.com/v1/bpi/historical/close.json'
    request.get(URL, function (err, res, body) {
        if (err) return cb(err)
        cb(null, JSON.parse(body))
    })
}

function insertRedis (client, data, cb) {
    var values = ['values']
    Object.keys(data).forEach(function (k) {
        values.push(data[k])
        values.push(k)
    })

    client.zadd(values, cb)
}

function getRange (client) {
    client.zrange('values', -1, -1, 'withscores', function (err, res) {
        if (err) throw err
        console.time('redis')
        console.log('range cb', res)
        console.log('One month max value is', res[1])
        client.quit()
    })
}

```


## further reading

* [node redis client](https://github.com/NodeRedis/node_redis)
* [ZADD](https://redis.io/commands/zadd)
* [ZRANGE](https://redis.io/commands/zrange)

