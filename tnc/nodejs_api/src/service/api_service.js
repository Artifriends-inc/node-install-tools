'use strict';

const config = require('../config/config.js');
const common = require('./api_common.js');

const rpc = require('../rpc/rpc.js');
const broadcast = require('./broadcast.js');
const database = require('./database.js');

var Service = {};

var _bluebird = require('bluebird');
var _bluebird2 = _interopRequireDefault(_bluebird);

var auth = require('../lib/auth');
var _auth2 = _interopRequireDefault(auth);

var memolib = require('../lib/memo');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Service.createAccount = function(req,res) {
	
	var creator = req.body.creator; 
	if(typeof creator == "undefined" || creator == ""  || creator == null) {
		creator = config.creator;	
	}
	var creatorWif = req.body.creator_wif; 
	if(typeof creatorWif == "undefined" || creatorWif == ""  || creatorWif == null) {
		creatorWif = config.creator_wif;	
	}
	
	var wif = common.get_private_key(creator, creatorWif, "active");

	var username = req.body.username; 
	var password = req.body.password; 
	
	console.log("createAccount :: " + username + " / " + password);

	var publicKeys = auth.generateKeys(username, password,[
		'owner',
		'active',
		'posting',
		'memo',
	]);

	var owner = {
		weight_threshold: 1,
		account_auths: [],
		key_auths: [[publicKeys.owner, 1]]
	};
	var active = {
		weight_threshold: 1,
		account_auths: [],
		key_auths: [[publicKeys.active, 1]]
	};
	var posting = {
		weight_threshold: 1,
		account_auths: [],
		key_auths: [[publicKeys.posting, 1]]
	};
	
	var jsonMetadata = "";

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("account_create");
	
	var param_data = {};

	param_data.creator = creator;
	param_data.new_account_name = username;
	param_data.owner = owner;
	param_data.active = active;
	param_data.posting = posting;
	param_data.memo_key =publicKeys.memo;
	param_data.json_metadata = jsonMetadata;

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['active'] = wif;
	
	var args = {};
	args.trx = trx;
	args.keys = keys;
	args.callback = function(data){
		if(typeof data.connection != "undefined") {		
			data.rpc.close(data.connection);
		}
		delete data.rpc;
		delete data.connection;

		res.json(data);
	};
	
	broadcast.doTrx(args);
	
};

Service.updateAccount = function(req,res) {
	
	var username = req.body.username; 
	var password = req.body.password; 
	var old_password = req.body.old_password;
	
	console.log("updateAccount :: " + username + " / " + old_password + "=>" + password);

	//var wif = auth.toWif(username, old_password, "owner");
	var wif = common.get_private_key(username, old_password, "owner");

	var publicKeys = auth.generateKeys(username, password,[
		'owner',
		'active',
		'posting',
		'memo',
	]);

	var owner = {
		weight_threshold: 1,
		account_auths: [],
		key_auths: [[publicKeys.owner, 1]]
	};
	var active = {
		weight_threshold: 1,
		account_auths: [],
		key_auths: [[publicKeys.active, 1]]
	};
	var posting = {
		weight_threshold: 1,
		account_auths: [],
		key_auths: [[publicKeys.posting, 1]]
	};
	
	var jsonMetadata = "";

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("account_update");
	
	var param_data = {};
	param_data.account = username;
	param_data.owner = owner;
	param_data.active = active;
	param_data.posting = posting;
	param_data.memo_key =publicKeys.memo;
	param_data.json_metadata = jsonMetadata;
	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;

	var keys = {};
	keys['active'] = wif;
	
	var args = {};
	args.trx = trx;
	args.keys = keys;
	args.callback = function(data){
		if(typeof data.connection != "undefined") {		
			data.rpc.close(data.connection);
		}
		delete data.rpc;
		delete data.connection;

		res.json(data);
	};

	broadcast.doTrx(args);
};

module.exports = Service;
