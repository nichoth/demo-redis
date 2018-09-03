# demo redis
Example of local development with redis


## setup
Start a docker container with redis

    $ docker pull redis
    $ docker run --name redis -p 7379:6379 -d redis
    $ docker ps # should show the redis process

Redis commander is a helpful gui app

    $ npm i -g redis-commander
    $ redis-commander --redis-port 7379

## further reading

* [node redis client](https://github.com/NodeRedis/node_redis)
* [ZADD](https://redis.io/commands/zadd)
* [ZRANGE](https://redis.io/commands/zrange)

