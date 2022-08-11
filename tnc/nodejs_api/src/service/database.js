'use strict';

const config = require('../config/config.js');
//const auth = require('../lib/auth.js');
const rpc = require('../rpc/rpc.js');

var DataBase = {};

var _bluebird = require('bluebird');
var _bluebird2 = _interopRequireDefault(_bluebird);

var auth = require('../lib/auth');
var _auth2 = _interopRequireDefault(auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const jsonrpc = "2.0";
var rpc_id = 0;

DataBase.doSearch = function(args){
	var rpc_data = {};
	rpc_data.jsonrpc = jsonrpc;
	rpc_data.method = "call";
	
	var params = [];
	params.push(args.api);
	params.push(args.func);
	
	
	params.push(args.param);
	
	rpc_data.params = params;	
	rpc_data.id = this.getId();

	if(args.connection == null) {
		rpc.connect().then(function (data) {
			var connection = data;

			rpc.send(JSON.stringify(rpc_data),connection).then(function (data) {
				if(typeof args.callback == "function") {
					data.rpc = rpc;
					data.connection = connection;
					args.callback(data);
				}else {
					rpc.close(connection);
				}
			}).catch(function (err) {
				if(typeof args.callback == "function") {
					err.connection = connection;
					err.rpc = rpc;

					args.callback(err);
				}else {
					rpc.close(connection);
				}
			});
		}).catch(function (err) {
			if(typeof args.callback == "function") {
				args.callback(err);
			}
		});
	}else {
		var connection = args.connection;
		rpc.send(JSON.stringify(rpc_data),connection).then(function (data) {
			
			if(typeof args.callback == "function") {
				data.rpc = rpc;
				data.connection = connection;
				args.callback(data);
			}else {
				rpc.close(connection);
			}
		}).catch(function (err) {
			if(typeof args.callback == "function") {
				err.connection = connection;
				err.rpc = rpc;

				args.callback(err);
			}else {
				rpc.close(connection);
			}
		});
	}
}


DataBase.getId = function () {
	rpc_id++;
	if(rpc_id > 99) {
		rpc_id = 1;
	}

	return rpc_id;
}

module.exports = DataBase;