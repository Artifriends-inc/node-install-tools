'use strict';

const config = require('../config/config.js');
const common = require('./api_common.js');

const rpc = require('../rpc/rpc.js');
const broadcast = require('./broadcast.js');
const database = require('./database.js');

var Transfer = {};

var _bluebird = require('bluebird');
var _bluebird2 = _interopRequireDefault(_bluebird);

var auth = require('../lib/auth');
var _auth2 = _interopRequireDefault(auth);

var memolib = require('../lib/memo');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Transfer.transfer = function(req,res) {
	
	var from = req.body.from;	
	var from_pwd = req.body.from_pwd;	
	var to = req.body.to;
	
	var temp_amount = req.body.amount;
	
	var amount = "";
	if(temp_amount.indexOf('.') > -1) {
		var arr_amount = temp_amount.split(".");
		amount = arr_amount[0] + "." + common.rpad(arr_amount[1],config.fee_string_rpad,"0"); 
	}else {
		amount = temp_amount + "." + common.rpad("",config.fee_string_rpad,"0"); 
	}
	amount = amount + " " + config.fee_string;
	
	var memo = req.body.memo;
	if(typeof memo == "undefined") {
		memo = "";
	} 

	var memo_key = req.body.memo_key;
	if(typeof memo_key == "undefined") {
		memo_key = "";
	} 
	
	var memo_private_key = "";

	if(memo_key == "") {
		if(!auth.isWif(from_pwd)) {
			memo_private_key = common.get_private_key(from, from_pwd, "memo");		
		}
	}else {
		memo_private_key = memo_key;
	}
	
	var wif = common.get_private_key(from, from_pwd, "active");
	
	if(memo_private_key != "" && memo != "" ) {
		var memo_public_key = auth.wifToPublic(memo_private_key);
		memo = memolib.encode(memo_private_key, memo_public_key, memo);
	}
	
	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("transfer");
	
	var param_data = {};
	param_data.from = from;
	param_data.to = to;
	param_data.amount = amount;
	param_data.memo = memo;
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
		delete data.connection; //console.log(data);
		res.json(data);
	};

	broadcast.doTrx(args);
	
};

module.exports = Transfer;
