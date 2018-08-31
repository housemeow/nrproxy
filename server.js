var redbird = require('redbird');
var fs = require('fs');

var config = readConfig();
var proxy = redbird({ port: config.port });

function readConfig() {
	return JSON.parse(fs.readFileSync('./config.json'));
}

function registerServers() {
	config.servers.forEach(function(server) {
		console.log('register server', server);
		proxy.register(server.name, server.target);
	});
}

function unregisterServers() {
	config.servers.forEach(function(server) {
		console.log('unregister server', server);
		proxy.unregister(server.name);
	});
}

registerServers();

fs.watch('./config.json', { encoding: 'utf8' }, function(eventType, filename) {
	console.log('config changed.');
	unregisterServers();
	config = readConfig();
	console.log('config', config);
	registerServers();
});