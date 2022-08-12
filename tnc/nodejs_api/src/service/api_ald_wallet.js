'use strict';

const config = require('../config/config.js');
const common = require('./api_common.js');

const rpc = require('../rpc/rpc.js');
const broadcast = require('./broadcast.js');
const database = require('./database.js');

var TNC_ALDWallet = {};

var _bluebird = require('bluebird');
var _bluebird2 = _interopRequireDefault(_bluebird);

var auth = require('../lib/auth');
var _auth2 = _interopRequireDefault(auth);

var memolib = require('../lib/memo');

var walletPrefix = "ALD";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

TNC_ALDWallet.createTNCWallet = function(req,res) {
	
	var creator = req.body.creator; 
	if(typeof creator == "undefined" || creator == ""  || creator == null) {
		creator = config.creator;	
	}
	var creatorWif = req.body.creator_wif; 
	if(typeof creatorWif == "undefined" || creatorWif == ""  || creatorWif == null) {
		creatorWif = config.creator_wif;	
	}
	
	var wif = common.get_private_key(creator, creatorWif, "active");

	var username = req.body.email; 
	var password = req.body.password; 

	if(typeof username == "undefined" || username == "" || username == null)
	{
		var data = {};
		data.status = "fail";
		res.json(data);
		return;
	}
	
	console.log("createTNCWallet :: " + username + " / " + password);

	var address = auth.generateAddress(username, walletPrefix);
	var walletAddress = address;

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
	param_data.new_account_name = walletAddress;		//username;
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

TNC_ALDWallet.getTNCAddress = function(req,res) {
	var username = req.body.email;
	var res_data = {};

	if(typeof username == "undefined" || username == "" || username == null)
	{
		var data = {};
		data.status = "fail";
		res.json(data);
		return;
	}

	var address = auth.generateAddress(username, walletPrefix);
	var walletAddress = address;

	console.log("getTNCAddress :: " + username + " / " + walletAddress);

	res_data.status = "success";
	res_data.address = walletAddress;

	res.json(res_data);	
};

TNC_ALDWallet.updateTNCWallet = function(req,res) {

	var username = req.body.email; 
	var password = req.body.password; 
	var old_password = req.body.old_password;

	if(typeof username == "undefined" || username == "" || username == null)
	{
		var data = {};
		data.status = "fail";
		res.json(data);
		return;
	}
	
	console.log("updateAccount :: " + username + " / " + old_password + "=>" + password);

	var address = auth.generateAddress(username, walletPrefix);
	var walletAddress = address;

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
	param_data.account = walletAddress;
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

TNC_ALDWallet.transferTNCWallet = function(req,res) {

	var address = auth.generateAddress(req.body.email, walletPrefix);
	var walletAddress = address;
	
	var from = req.body.email;	
	var from_pwd = req.body.password;	
	var to = req.body.to;
	
	var temp_amount = req.body.amount;

	if(typeof from == "undefined" || from == "" || from == null)
	{
		var data = {};
		data.status = "fail";
		res.json(data);
		return;
	}
	
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
	param_data.from = walletAddress;	//from;
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

TNC_ALDWallet.stakingInfo = function(req,res){
	var name = req.body.name;
	
	var args = {};
	args.api = "database_api";
	args.func = "get_fund_info";
	//args.name = name;

	var param = [];
//	var subparam = [];
//	subparam.push(name);
	param.push(name);
	args.param = param;

	args.callback = function(data){
		if(typeof data.connection != "undefined") {		
			data.rpc.close(data.connection);
		}
		delete data.rpc;
		delete data.connection;

		res.json(data);
	};

	database.doSearch(args);
};

TNC_ALDWallet.stakingTNCFund = function(req,res) {
	
	var address = auth.generateAddress(req.body.email, walletPrefix);
	var walletAddress = address;

	var from = req.body.email;	
	var pwd = req.body.password;	
	var fund_name = req.body.fund_name;	
	var request_id = req.body.request_id;
	var usertype = req.body.usertype;
	var month = req.body.month;
	
	var temp_amount = req.body.amount;
	
	if(typeof from == "undefined" || from == "" || from == null)
	{
		var data = {};
		data.status = "fail";
		res.json(data);
		return;
	}

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

	var memo_private_key = common.get_private_key(from, pwd, "memo");
	var wif = common.get_private_key(from, pwd, "active");
	
	if(memo_private_key != "" && memo != "" ) {
		var memo_public_key = auth.wifToPublic(memo_private_key);
		memo = memolib.encode(memo_private_key, memo_public_key, memo);
	}

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("staking_fund");
	
	var param_data = {};
	param_data.from = walletAddress;//from;
	param_data.fund_name = fund_name;
	param_data.request_id = parseInt(request_id, 10);
	param_data.amount = amount;
	param_data.memo = memo;
	param_data.usertype = parseInt(usertype, 10);
	param_data.month = parseInt(month, 10);

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

TNC_ALDWallet.transferTNCFund = function(req,res) {
	
	var address = auth.generateAddress(req.body.email, walletPrefix);
	var walletAddress = address;

	var from = req.body.email;	
	var from_pwd = req.body.password;	
	var fund_name = req.body.fund_name;	

	var temp_amount = req.body.amount;

	if(typeof from == "undefined" || from == "" || from == null)
	{
		var data = {};
		data.status = "fail";
		res.json(data);
		return;
	}
	
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

	var memo_private_key = common.get_private_key(from, from_pwd, "memo");
	var wif = common.get_private_key(from, from_pwd, "active");
	
	if(memo_private_key != "" && memo != "" ) {
		var memo_public_key = auth.wifToPublic(memo_private_key);
		memo = memolib.encode(memo_private_key, memo_public_key, memo);
	}

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("transfer_fund");
	
	var param_data = {};
	param_data.from = walletAddress;//from;
	param_data.fund_name = fund_name;
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

TNC_ALDWallet.getTNCStakingFundFrom = function(req,res){
	var name = req.body.name;
	var address = auth.generateAddress(req.body.email, walletPrefix);
	var walletAddress = address;

	if(typeof req.body.email == "undefined" || req.body.email == "" || req.body.email == null)
	{
		var data = {};
		data.status = "fail";
		res.json(data);
		return;
	}
	
	var args = {};
	args.api = "database_api";
	args.func = "get_fund_withdraw_from";

	var param = [];
	param.push(name);
	param.push(walletAddress);
	args.param = param;

	args.callback = function(data){
		if(typeof data.connection != "undefined") {		
			data.rpc.close(data.connection);
		}
		delete data.rpc;
		delete data.connection;

		res.json(data);
	};

	database.doSearch(args);
};

TNC_ALDWallet.getTNCStakingFundList = function(req,res){
	var name = req.body.name;
	var limit = req.body.limit;

	var args = {};
	args.api = "database_api";
	args.func = "get_fund_withdraw_list";

	var param = [];
	param.push(name);
	param.push(limit);
	args.param = param;

	args.callback = function(data){
		if(typeof data.connection != "undefined") {		
			data.rpc.close(data.connection);
		}
		delete data.rpc;
		delete data.connection;

		res.json(data);
	};

	database.doSearch(args);
};

TNC_ALDWallet.getTNCWalletHistory = function(req,res){

	var from = req.body.from;
	var limit = req.body.limit;

	var address = auth.generateAddress(req.body.email, walletPrefix);
	var walletAddress = address;

	if(typeof from == "undefined" || from == "" || from == null)
	{
		var data = {};
		data.status = "fail";
		res.json(data);
		return;
	}

	var args = {};
	args.api = "database_api";
	args.func = "get_account_history";

	var param = [];
	//param.push(account);
	param.push(walletAddress);
	param.push(from);
	param.push(limit);
	args.param = param;

	args.callback = function(data){
		if(typeof data.connection != "undefined") {		
			data.rpc.close(data.connection);
		}
		delete data.rpc;
		delete data.connection;
		res.json(data);
	};

	database.doSearch(args);
};

TNC_ALDWallet.getTNCWalletInfo = function(req,res){
	var username = req.body.email;	

	if(typeof username == "undefined" || username == "" || username == null)
	{
		var data = {};
		data.status = "fail";
		res.json(data);
		return;
	}

	var address = auth.generateAddress(req.body.email, walletPrefix);
	var walletAddress = address;
	
	var args = {};
	args.api = "database_api";
	args.func = "get_accounts";

	var param = [];
	var subparam = [];
	//for(var i=0;i<usernames.length;i++){
		subparam.push(walletAddress);
	//}
	param.push(subparam);
	args.param = param;

	args.callback = function(data){
		if(typeof data.connection != "undefined") {		
			data.rpc.close(data.connection);
		}
		delete data.rpc;
		delete data.connection;
		res.json(data);
	};

	database.doSearch(args);
};

TNC_ALDWallet.transferLockTNCWallet = function(req,res) {
	
	var address = auth.generateAddress(req.body.email, walletPrefix);
	var walletAddress = address;

	var from = req.body.email;	
	var from_pwd = req.body.password;	
	var to = req.body.to;
	var request_id = req.body.request_id;
	var complete = req.body.complete;
	
	var temp_amount = req.body.amount;

	if(typeof from == "undefined" || from == "" || from == null)
	{
		var data = {};
		data.status = "fail";
		res.json(data);
		return;
	}
	
	var amount = "";
	if(temp_amount.indexOf('.') > -1) {
		var arr_amount = temp_amount.split(".");
		amount = arr_amount[0] + "." + common.rpad(arr_amount[1],config.fee_string_rpad,"0"); 
	}else {
		amount = temp_amount + "." + common.rpad("",config.fee_string_rpad,"0"); 
	}
	amount = amount + " " + config.fee_string;

	var split_pay_month = req.body.split_pay_month;

	var memo = req.body.memo;
	if(typeof memo == "undefined") {
		memo = "";
	} 

	var memo_key = req.body.memo_key;
	if(typeof memo_key == "undefined") {
		memo_key = "";
	} 

	var memo_private_key = common.get_private_key(from, from_pwd, "memo");
	var wif = common.get_private_key(from, from_pwd, "active");
	
	if(memo_private_key != "" && memo != "" ) {
		var memo_public_key = auth.wifToPublic(memo_private_key);
		memo = memolib.encode(memo_private_key, memo_public_key, memo);
	}
	
	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("transfer_savings");
	
	var param_data = {};
	param_data.from = walletAddress;// from;
	param_data.request_id = parseInt(request_id, 10);
	param_data.to = to;
	param_data.amount = amount;
	param_data.total_amount = amount;
	param_data.split_pay_order = 1;
	param_data.split_pay_month = parseInt(split_pay_month, 10);
	param_data.memo = memo;
	param_data.complete = complete;
	operations_sub.push(param_data); //console.log(JSON.stringify(param_data));
	operations.push(operations_sub);
	//}

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

TNC_ALDWallet.getTransferLockFrom = function(req,res){
	var from = req.body.email;

	if(typeof from == "undefined" || from == "" || from == null)
	{
		var data = {};
		data.status = "fail";
		res.json(data);
		return;
	}

	var address = auth.generateAddress(req.body.email, walletPrefix);
	var walletAddress = address;

	var args = {};
	args.api = "database_api";
	args.func = "get_savings_withdraw_from";

	var param = [];
	param.push(walletAddress);
	args.param = param;

	args.callback = function(data){
		if(typeof data.connection != "undefined") {		
			data.rpc.close(data.connection);
		}
		delete data.rpc;
		delete data.connection;
		res.json(data);
	};

	database.doSearch(args);
};

TNC_ALDWallet.getTransferLockTo = function(req,res){
	var to = req.body.email;

	if(typeof to == "undefined" || to == "" || to == null)
	{
		var data = {};
		data.status = "fail";
		res.json(data);
		return;
	}

	var address = auth.generateAddress(req.body.email, walletPrefix);
	var walletAddress = address;

	var args = {};
	args.api = "database_api";
	args.func = "get_savings_withdraw_to";

	var param = [];
	param.push(walletAddress);
	args.param = param;

	args.callback = function(data){
		if(typeof data.connection != "undefined") {		
			data.rpc.close(data.connection);
		}
		delete data.rpc;
		delete data.connection;
		res.json(data);
	};

	database.doSearch(args);
};

TNC_ALDWallet.checkAccount = function(req,res) {
	/*
	1. getAccounts로 계정 정보 가져 온다
	2. wif 인경우 별 처리 하지 않고 password 인경우 wif 변환
	3. auth.wifIsValid(privWif, pubWif) 해서 verify 한다
	*/
	var res_data = {};
	
	var username = req.body.email;
	var password = req.body.password; //password or wif

	var address = auth.generateAddress(username, walletPrefix);
	var walletAddress = address;

	if(typeof username == "undefined" || username == "" || username == null)
	{
		var data = {};
		data.status = "fail";
		res.json(data);
		return;
	}
	
	var args = {};
	args.api = "database_api";
	args.func = "get_accounts";

	var param = [];
	var subparam = [];
	subparam.push(walletAddress);
	
	param.push(subparam);
	args.param = param;

	args.callback = function(data){
		if(typeof data.connection != "undefined") {		
			data.rpc.close(data.connection);
		}
		delete data.rpc;
		delete data.connection;

		res_data.status = data.status;
		
		if(data.status == "success") {
			var public_key = data.result[0].owner.key_auths[0][0];
			
			var valid = false;
			
			if(auth.isWif(password)) {
				valid = false;
			}else {
				var private_key = common.get_private_key(username, password, "owner");
				valid = auth.wifIsValid(private_key, public_key);
			}
			
			res_data.auth = valid;
		}else {
			res_data = data;
			res_data.auth = false;
		}
		
		res.json(res_data);
	};

	database.doSearch(args);
}

module.exports = TNC_ALDWallet;