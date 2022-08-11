'use strict';

const config = require('../config/config.js');
const common = require('./api_common.js');

const rpc = require('../rpc/rpc.js');

var Auth = {};

var _bluebird = require('bluebird');
var _bluebird2 = _interopRequireDefault(_bluebird);

var auth = require('../lib/auth');
var _auth2 = _interopRequireDefault(auth);

var memolib = require('../lib/memo');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Auth.toWif = function(req,res) {
	var username = req.body.username;
	var password = req.body.password;
	var role = req.body.role;

	var res_data = {};
	res_data.result = auth.toWif(username, password, role);
		
	res.json(res_data);	
};

Auth.isWif = function(req,res) {
	var wif = req.body.wif;
	var res_data = {};
	res_data.result = auth.isWif(wif);
		
	res.json(res_data);	
};

Auth.wifIsValid = function(req,res) {
	var private_key = req.body.private_key;
	var public_key = req.body.public_key;
	var res_data = {};
	if(auth.isWif(private_key)){
		res_data.result = auth.wifIsValid(private_key,public_key);
	}else {
		res_data.result = false;		
	}
	
	res.json(res_data);	
};

Auth.wifToPublic = function(req,res) {
	var private_key = req.body.private_key;
	var res_data = {};
	if(auth.isWif(private_key)){
		res_data.result = auth.wifToPublic(private_key);
	}else {
		res_data.result = false;		
	}
	
	res.json(res_data);	
};


Auth.generateKeys = function(req,res) {
	var username = req.body.username;
	var password = req.body.password;
	var roles = req.body.roles;
	roles = JSON.parse(roles);

	var key_roles = [];
	for(var i=0;i<roles.length;i++){
		key_roles.push(roles[i]);
	}
	
	var res_data = {};
	res_data.result = auth.generateKeys(username,password,key_roles);
	
	res.json(res_data);	
};

Auth.getPrivateKeys = function(req,res) {
	var username = req.body.username;
	var password = req.body.password;
	var roles = req.body.roles;
	roles = JSON.parse(roles);

	var key_roles = [];
	for(var i=0;i<roles.length;i++){
		key_roles.push(roles[i]);
	}
	
	var res_data = {};
	res_data.result = auth.getPrivateKeys(username,password,key_roles);
	
	res.json(res_data);	
};

module.exports = Auth;