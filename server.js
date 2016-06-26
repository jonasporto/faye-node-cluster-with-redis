var cluster = require('cluster'),
    numCPUs = require('os').cpus().length;

if (cluster.isMaster) {

	for (var i = 0; i < Math.round(numCPUs / 2); i++) {
		cluster.fork();
	}
    return;
}

var http       = require('http');
var faye       = require('faye');
var faye_redis = require('faye-redis');

var port   = (process.env.PORT || 8001);
var server = http.createServer();

var redis_to_go = require("url").parse(process.env.REDISTOGO_URL);
var bayeux  = new faye.NodeAdapter({
	mount: '/faye',
	timeout: 25,
	engine: {
	 type: faye_redis,
	 host: redis_to_go.hostname,
	 port: redis_to_go.port,
	 password: redis_to_go.auth.split(":")[1]
	}
});


bayeux.attach(server);
server.listen(port, function() {
	console.log('App is running on port', port);
});