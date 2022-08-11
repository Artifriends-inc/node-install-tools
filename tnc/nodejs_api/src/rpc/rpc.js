
var Rpc = {};
Rpc.conn = null;

//var conn;

Rpc.connect = function() {

	return new Promise(function (resolve, reject) {
		var config = require('../config/config.js');
		var WebSocketClient = require('websocket').client;
		var client = new WebSocketClient({timeout:20000,reconnection:true});
		client.config.maxReceivedFrameSize=1000000000;
		
		client.connect(config.api_url);
		
		client.on('connectFailed', function(error) {
			var res_data = {};
			res_data.status = "fail";
			res_data.result = error.toString();

			reject(res_data);
		});

		client.on('connect', function(connection) {
			console.log('WebSocket Client Connected');
			
			connection.on('error', function(error) {
				var res_data = {};
				res_data.status = "fail";
				res_data.result = error.toString();

				reject(res_data);
			});
			connection.on('close', function() {
				console.log('WebSocket Client Connection Closed');
			});

			resolve(connection);
		});
	});
};

Rpc.send = function(rpc,connection) {
	
	return new Promise(function (resolve, reject) {
		connection.on('message', function(message) { //console.log(message);
			if (message.type === 'utf8') {
		
				var result = JSON.parse(message.utf8Data);
				if(typeof result.result != "undefined") {
					var res_data = {};
					res_data.status = "success";
					res_data.result = result.result;
					resolve(res_data);
				}else {
					var res_data = {};
					res_data.status = "fail";
					res_data.result = result.error;
					resolve(res_data);
				}

			}
		});

		if(connection.connected) {
			connection.sendUTF(rpc);
			console.log('sendUTF ' + "  " +  rpc);
		}
		
	});
};

Rpc.callback = function(rpc,callback,connection) {
	
	connection.on('message', function(message) { 
		if (message.type === 'utf8') {
			var result = JSON.parse(message.utf8Data);
			callback(result);
		}
	});

	if(connection.connected) {
		connection.sendUTF(rpc);
	}
};


Rpc.close = function(connection) {
	connection.close();
};

module.exports = Rpc;