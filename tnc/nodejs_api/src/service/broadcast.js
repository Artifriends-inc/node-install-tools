'use strict';

const config = require('../config/config.js');
//const auth = require('../lib/auth.js');
const rpc = require('../rpc/rpc.js');

var BroadCast = {};

var _bluebird = require('bluebird');
var _bluebird2 = _interopRequireDefault(_bluebird);

var auth = require('../lib/auth');
var _auth2 = _interopRequireDefault(auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const jsonrpc = "2.0";
var rpc_id = 0;

var obj = BroadCast;
BroadCast.doTrx = function(args){
	
	var rpc_data = {};
	rpc_data.jsonrpc = jsonrpc;
	rpc_data.method = "call";
	var params = [];
	params.push("database_api");
	params.push("get_dynamic_global_properties");
	var param = [];
	params.push(param);
	rpc_data.params = params;	
	rpc_data.id = obj.getId();
	
	if(args.connection == null) {
		rpc.connect().then(function (data) {
			var connection = data;
			
			rpc.send(JSON.stringify(rpc_data),connection).then(function (data) {
				
				if(data.status == "success") {
					var chainDate = new Date(data.result.time + 'Z');
					var refBlockNum = data.result.last_irreversible_block_num - 1 & 0xFFFF;
					
					var rpc_data = {};
					rpc_data.jsonrpc = jsonrpc;
					rpc_data.method = "call";
					
					var params = [];
					params.push("database_api");
					params.push("get_block");
					
					var param = [];
					param.push(data.result.last_irreversible_block_num);
					params.push(param);

					rpc_data.params = params;	
					rpc_data.id = obj.getId();
					
					rpc.send(JSON.stringify(rpc_data),connection).then(function (data) {
						if(data.status == "success") {
							var headBlockId = data.result.previous;
							
							var trx = args.trx;
							var keys = args.keys;
							
							var transaction = Object.assign({
								ref_block_num: refBlockNum,
								ref_block_prefix: new Buffer(headBlockId, 'hex').readUInt32LE(4),
								expiration: new Date(chainDate.getTime() + 600 * 1000)
							}, trx);
							
							var signatures = _auth2.default.signTransaction(transaction, keys);
								
							var rpc_data = {};
							rpc_data.jsonrpc = jsonrpc;
							rpc_data.method = "call";
							var params = [];
							params.push("network_broadcast_api");
							params.push("broadcast_transaction_synchronous");
							
							var param = [];
							param.push(signatures);
							params.push(param);
							rpc_data.params = params;	
							rpc_data.id = obj.getId();
						
							rpc.send(JSON.stringify(rpc_data),connection).then(function (data) {
								//rpc.close(connection);
								if(typeof args.callback == "function") { 
									console.log("connection " + data);
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
						}else {
							if(typeof args.callback == "function") {
								data.rpc = rpc;
								data.connection = connection;
								args.callback(data);
							}else {
								rpc.close(connection);
							}
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

				}else {
					if(typeof args.callback == "function") {
						data.rpc = rpc;
						data.connection = connection;
						args.callback(data);
					}else {
						rpc.close(connection);
					}
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
			
			if(data.status == "success") {
				var chainDate = new Date(data.result.time + 'Z');
				var refBlockNum = data.result.last_irreversible_block_num - 1 & 0xFFFF;
				
				var rpc_data = {};
				rpc_data.jsonrpc = jsonrpc;
				rpc_data.method = "call";
				
				var params = [];
				params.push("database_api");
				params.push("get_block");
				
				var param = [];
				param.push(data.result.last_irreversible_block_num);
				params.push(param);

				rpc_data.params = params;	
				rpc_data.id = obj.getId();
				
				rpc.send(JSON.stringify(rpc_data),connection).then(function (data) {
					if(data.status == "success") {
						var headBlockId = data.result.previous;
						
						var trx = args.trx;
						var keys = args.keys;
						
						var transaction = Object.assign({
							ref_block_num: refBlockNum,
							ref_block_prefix: new Buffer(headBlockId, 'hex').readUInt32LE(4),
							expiration: new Date(chainDate.getTime() + 600 * 1000)
						}, trx);
						
						var signatures = _auth2.default.signTransaction(transaction, keys);
							
						var rpc_data = {};
						rpc_data.jsonrpc = jsonrpc;
						rpc_data.method = "call";
						var params = [];
						params.push("network_broadcast_api");
						params.push("broadcast_transaction_synchronous");
						
						var param = [];
						param.push(signatures);
						params.push(param);
						rpc_data.params = params;	
						rpc_data.id = obj.getId();
					
						rpc.send(JSON.stringify(rpc_data),connection).then(function (data) {
							//rpc.close(connection);
							if(typeof args.callback == "function") { 
								console.log("send " + data);
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
					}else {
						if(typeof args.callback == "function") {
							data.rpc = rpc;
							data.connection = connection;
							args.callback(data);
						}else {
							rpc.close(connection);
						}
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

			}else {
				if(typeof args.callback == "function") {
					data.rpc = rpc;
					data.connection = connection;
					args.callback(data);
				}else {
					rpc.close(connection);
				}
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

BroadCast.getId = function () {
	rpc_id++;
	if(rpc_id > 99) {
		rpc_id = 1;
	}

	return rpc_id;
}

module.exports = BroadCast;