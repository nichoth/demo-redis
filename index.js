var redis = require('redis')
var request = require('request')

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

function getRange (client) {
    client.zrange('values', -1, -1, 'withscores', function (err, res) {
        if (err) throw err
        console.time('redis')
        console.log('range cb', res)
        console.log('One month max value is', res[1])
        client.quit()
    })
}

