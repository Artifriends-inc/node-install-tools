'use strict';

const config = require('../config/config.js');
const common = require('./api_common.js');

const rpc = require('../rpc/rpc.js');
const broadcast = require('./broadcast.js');
const database = require('./database.js');

var version = config.version;
var type_lib = "../lib/serializer/types.js";
var _types = require(type_lib);
var operation_lib = "../lib/serializer/operations.js";
var _operations = require(operation_lib);

var Token = {};

var _bluebird = require('bluebird');
var _bluebird2 = _interopRequireDefault(_bluebird);

var auth = require('../lib/auth');
var _auth2 = _interopRequireDefault(auth);

var memolib = require('../lib/memo');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }


Token.createToken = function(req,res) {
	var active_key = req.body.dapp_private_key;
	
	var name = req.body.name;	
	var symbol_name = req.body.symbol_name;	
	var publisher = req.body.publisher;
	var dapp_key = auth.wifToPublic( req.body.dapp_private_key );
	var dappname = req.body.dappname;
	var init_supply_amount = req.body.init_supply_amount; //token 최초 생성시는 정수형
	
	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [];
	param_data.required_posting_auths = [];
	param_data.required_auths = [
	{
		weight_threshold: 1,
		account_auths: [],
		key_auths: [[dapp_key, 1]]
	}];

	param_data.id = 'token';
	
	var json = [];
	json.push("create_token");
	
	var json_sub = {};
	json_sub.name = name;
	json_sub.symbol_name = symbol_name;
	json_sub.publisher = publisher;
	json_sub.dapp_key = dapp_key;
	json_sub.dapp_name = dappname;
	json_sub.init_supply_amount = parseInt(init_supply_amount);
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['active'] = active_key; 
	
	var args = {};
	args.trx = trx;
	args.keys = keys;//console.log(JSON.stringify(args));
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

Token.issueToken = function(req,res) {
	var active_key = req.body.dapp_private_key;
	
	var name = req.body.name;	
	var publisher = req.body.publisher;
	var dapp_key = auth.wifToPublic( req.body.dapp_private_key );
	var temp_amount = req.body.reissue_amount;
	var symbol_name = req.body.symbol_name;

	var reissue_amount = "";
	if(temp_amount.indexOf('.') > -1) {
		var arr_amount = temp_amount.split(".");
		reissue_amount = arr_amount[0] + "." + common.rpad(arr_amount[1],config.fee_string_rpad,"0"); 
	}else {
		reissue_amount = temp_amount + "." + common.rpad("",config.fee_string_rpad,"0"); 
	}
	reissue_amount = reissue_amount + " " + symbol_name;
	
	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [];
	param_data.required_posting_auths = [];
	param_data.required_auths = [
	{
		weight_threshold: 1,
		account_auths: [],
		key_auths: [[dapp_key, 1]]
	}];

	param_data.id = 'token';
	
	var json = [];
	json.push("issue_token");
	
	var json_sub = {};
	json_sub.name = name;
	json_sub.publisher = publisher;
	json_sub.dapp_key = dapp_key;
	json_sub.reissue_amount = reissue_amount;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['active'] = active_key; 
	
	var args = {};
	args.trx = trx;
	args.keys = keys;//console.log(JSON.stringify(args));
	args.callback = function(data){
		if(typeof data.connection != "undefined") {		
			data.rpc.close(data.connection);
		}
		delete data.rpc;
		delete data.connection;
		console.log(data);

		res.json(data);
	};
	
	broadcast.doTrx(args);
};

Token.transferToken = function(req,res) {

	var from = req.body.from;	
	
	var wif = req.body.wif;
	var to = req.body.to;	
	var temp_amount = req.body.amount;
	var symbol_name = req.body.symbol_name;
	var memo = req.body.memo;
	if(typeof memo == "undefined") {
		memo = "";
	} 
	
	var memo_key = req.body.memo_key;
	if(typeof memo_key == "undefined") {
		memo_key = "";
	} 

	var amount = "";
	if(temp_amount.indexOf('.') > -1) {
		var arr_amount = temp_amount.split(".");
		amount = arr_amount[0] + "." + common.rpad(arr_amount[1],config.fee_string_rpad,"0"); 
	}else {
		amount = temp_amount + "." + common.rpad("",config.fee_string_rpad,"0"); 
	}
	amount = amount + " " + symbol_name;
	
	var memo_private_key = common.get_private_key(from, wif, "memo");
	var active_key = common.get_private_key(from, wif, "active");

	if(memo_private_key != "" && memo != "" ) {
		var memo_public_key = auth.wifToPublic(memo_private_key);
		memo = memolib.encode(memo_private_key, memo_public_key, memo);
	}

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [from];
	param_data.required_posting_auths = [];
	param_data.required_auths = [];
	param_data.id = 'token';
	
	var json = [];
	json.push("transfer_token");
	
	var json_sub = {};
	json_sub.from = from;
	json_sub.to = to;
	json_sub.amount = amount;
	json_sub.memo = memo;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['active'] = active_key;
	
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

Token.burnToken = function(req,res) {
	
	var account = req.body.account;	
	
	var wif = req.body.wif;	

	var active_key = common.get_private_key(account, wif, "active");
	
	var temp_amount = req.body.amount;	
	var symbol_name = req.body.symbol_name;

	var amount = "";
	if(temp_amount.indexOf('.') > -1) {
		var arr_amount = temp_amount.split(".");
		amount = arr_amount[0] + "." + common.rpad(arr_amount[1],config.fee_string_rpad,"0"); 
	}else {
		amount = temp_amount + "." + common.rpad("",config.fee_string_rpad,"0"); 
	}
	amount = amount + " " + symbol_name;
	
	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [account];
	param_data.required_posting_auths = [];
	param_data.required_auths = [];
	param_data.id = 'token';
	
	var json = [];
	json.push("burn_token");
	
	var json_sub = {};
	json_sub.account = account;
	json_sub.amount = amount;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['active'] = active_key;
	
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

Token.setupTokenFund = function(req,res) {
	var wif = req.body.wif;	
	var publisher = req.body.publisher;	
	var token = req.body.token;
	var fund = req.body.fund;

	var active_key = common.get_private_key(publisher, wif, "active");
	
	var temp_fund = req.body.init_fund;	
	var symbol_name = req.body.symbol_name;

	var init_fund = "";
	if(temp_fund.indexOf('.') > -1) {
		var arr_fund = temp_fund.split(".");
		init_fund = arr_fund[0] + "." + common.rpad(arr_fund[1], config.fee_string_rpad,"0"); 
	}else {
		init_fund = temp_fund + "." + common.rpad("",config.fee_string_rpad,"0"); 
	}
	init_fund = init_fund + " " + symbol_name;

	
	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [publisher];
	param_data.required_posting_auths = [];
	param_data.required_auths = [];
	param_data.id = 'token';
	
	var json = [];
	json.push("setup_token_fund");
	
	var json_sub = {};
	json_sub.token_publisher = publisher;
	json_sub.token = token;
	json_sub.fund_name = fund;
	json_sub.init_fund_balance = init_fund;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['active'] = active_key;
	
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

Token.setTokenStakingInterest = function(req,res) {
	var wif = req.body.wif;	
	var publisher = req.body.publisher;	
	var token = req.body.token;
	var month = req.body.month;
	var interest = req.body.interest;

	var active_key = common.get_private_key(publisher, wif, "active");
	
	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [publisher];
	param_data.required_posting_auths = [];
	param_data.required_auths = [];
	param_data.id = 'token';
	
	var json = [];
	json.push("set_token_staking_interest");
	
	var json_sub = {};
	json_sub.token_publisher = publisher;
	json_sub.token = token;
	json_sub.month = month;
	json_sub.percent_interest_rate = interest;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['active'] = active_key;
	
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

Token.transferTokenFund = function(req,res) {

	var from = req.body.from;	
	var wif = req.body.wif;
	var token = req.body.token;
	var fund = req.body.fund;	
	var temp_amount = req.body.amount;
	var symbol_name = req.body.symbol_name;
	var memo = req.body.memo;

	if(typeof memo == "undefined") {
		memo = "";
	} 

	var amount = "";
	if(temp_amount.indexOf('.') > -1) {
		var arr_amount = temp_amount.split(".");
		amount = arr_amount[0] + "." + common.rpad(arr_amount[1],config.fee_string_rpad,"0"); 
	}else {
		amount = temp_amount + "." + common.rpad("",config.fee_string_rpad,"0"); 
	}
	amount = amount + " " + symbol_name;
	
	var active_key = common.get_private_key(from, wif, "active");

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [from];
	param_data.required_posting_auths = [];
	param_data.required_auths = [];
	param_data.id = 'token';
	
	var json = [];
	json.push("transfer_token_fund");
	
	var json_sub = {};
	json_sub.from = from;
	json_sub.token = token;
	json_sub.fund_name = fund;
	json_sub.amount = amount;
	json_sub.memo = memo;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['active'] = active_key;
	
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

Token.stakingTokenFund = function(req,res) {

	var from = req.body.from;	
	var wif = req.body.wif;
	var token = req.body.token;
	var fund = req.body.fund;	
	var req_id = req.body.req_id;
	var temp_amount = req.body.amount;
	var symbol_name = req.body.symbol_name;
	var memo = req.body.memo;
	var month = req.body.month;

	if(typeof memo == "undefined") {
		memo = "";
	} 

	var amount = "";
	if(temp_amount.indexOf('.') > -1) {
		var arr_amount = temp_amount.split(".");
		amount = arr_amount[0] + "." + common.rpad(arr_amount[1],config.fee_string_rpad,"0"); 
	}else {
		amount = temp_amount + "." + common.rpad("",config.fee_string_rpad,"0"); 
	}
	amount = amount + " " + symbol_name;
	
	var active_key = common.get_private_key(from, wif, "active");

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [from];
	param_data.required_posting_auths = [];
	param_data.required_auths = [];
	param_data.id = 'token';
	
	var json = [];
	json.push("staking_token_fund");
	
	var json_sub = {};
	json_sub.from = from;
	json_sub.token = token;
	json_sub.fund_name = fund;
	json_sub.request_id = req_id;
	json_sub.amount = amount;
	json_sub.memo = memo;
	json_sub.month = month;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['active'] = active_key;
	
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

Token.getToken = function(req,res){
	var tokennames = req.body.tokennames;	
	tokennames = JSON.parse(tokennames);
	
	var args = {};
	args.api = "token_api";
	args.func = "get_token";

	var param = [];
	//var subparam = [];
	for(var i=0;i<tokennames.length;i++){
		param.push(tokennames[i]);
	}
	//param.push(subparam);
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

Token.LookUpTokens = function(req,res){
	var tokennames = req.body.tokennames;	
	tokennames = JSON.parse(tokennames);
	var count = req.body.count;

	var args = {};
	args.api = "token_api";
	args.func = "lookup_tokens";

	var param = [];
	//var subparam = [];
	for(var i=0;i<tokennames.length;i++){
		param.push(tokennames[i]);
	}
	param.push(count);

	//param.push(subparam);
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

Token.getTokenBalance = function(req,res){
	
	var accounts = req.body.accounts;	
	accounts = JSON.parse(accounts);
	
	var args = {};
	args.api = "token_api";
	args.func = "get_token_balance";

	var param = [];
	//var subparam = [];
	for(var i=0;i<accounts.length;i++){
		param.push(accounts[i]);
	}
	//param.push(subparam);
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

Token.getAccountsByToken = function(req,res){

	var tokennames = req.body.tokennames;	
	tokennames = JSON.parse(tokennames);
	
	var args = {};
	args.api = "token_api";
	args.func = "get_accounts_by_token";

	var param = [];
	//var subparam = [];
	for(var i=0;i<tokennames.length;i++){
		param.push(tokennames[i]);
	}
	//param.push(subparam);
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

Token.getTokensByDapp = function(req,res){

	var dappnames = req.body.dappnames;	
	dappnames = JSON.parse(dappnames);
	
	var args = {};
	args.api = "token_api";
	args.func = "get_tokens_by_dapp";

	var param = [];
	for(var i=0;i<dappnames.length;i++){
		param.push(dappnames[i]);
	}
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

Token.getTokenFund = function(req,res){

	var tokenname = req.body.tokenname;	
	var fundname = req.body.fundname
	
	var args = {};
	args.api = "token_api";
	args.func = "get_token_fund";

	var param = [];
	param.push(tokenname);
	param.push(fundname);

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

Token.getTokenStakingInterest = function(req,res){

	var tokenname = req.body.tokenname;	
	
	var args = {};
	args.api = "token_api";
	args.func = "get_token_staking_interest";

	var param = [];
	param.push(tokenname);

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

Token.getTokenStakingList = function(req,res){
	var account = req.body.account;	
	var tokenname = req.body.tokenname;

	var args = {};
	args.api = "token_api";
	args.func = "get_token_staking_list";

	var param = [];
	param.push(account);
	param.push(tokenname);

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

Token.lookupTokenFundWithdraw = function(req,res){
	var tokenname = req.body.tokenname;	
	var fundname = req.body.fundname;
	var account = req.body.account;
	var req_id = req.body.req_id;
	var count = req.body.count;

	var args = {};
	args.api = "token_api";
	args.func = "lookup_token_fund_withdraw";

	var param = [];

	if(account == null)
		account = "";

	if(req_id == null)
		req_id = 0;

	param.push(tokenname);
	param.push(fundname);
	param.push(account);
	param.push(req_id);
	param.push(count);

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

Token.transferTokenSavings = function(req,res) {
	var from = req.body.from;	
	var wif = req.body.wif;
	var token = req.body.token;
	var to = req.body.to;	
	var reqId = req.body.req_id;
	var tempAmount = req.body.amount;
	var symbolName = req.body.symbol_name;
	var splitPayMonth = req.body.split_pay_month;
	var memo = req.body.memo;
	var nextDate = req.body.next_date;

	if(typeof memo == "undefined") {
		memo = "";
	} 

	var amount = "";
	if(tempAmount.indexOf('.') > -1) {
		var arr_amount = tempAmount.split(".");
		amount = arr_amount[0] + "." + common.rpad(arr_amount[1],config.fee_string_rpad,"0"); 
	}else {
		amount = tempAmount + "." + common.rpad("",config.fee_string_rpad,"0"); 
	}
	amount = amount + " " + symbolName;
	
	var active_key = common.get_private_key(from, wif, "active");

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [from];
	param_data.required_posting_auths = [];
	param_data.required_auths = [];
	param_data.id = 'token';
	
	var json = [];
	json.push("transfer_token_savings");
	
	var json_sub = {};
	json_sub.token = token;
	json_sub.from = from;
	json_sub.to = to;
	json_sub.request_id = reqId;
	json_sub.amount = amount;
	json_sub.split_pay_month = splitPayMonth;
	json_sub.memo = memo;
	json_sub.next_date = nextDate;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['active'] = active_key;
	
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

Token.cancelTransferTokenSavings = function(req,res) {
	var from = req.body.from;	
	var wif = req.body.wif;
	var token = req.body.token;
	var to = req.body.to;	
	var reqId = req.body.req_id;

	var active_key = common.get_private_key(from, wif, "active");

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [from];
	param_data.required_posting_auths = [];
	param_data.required_auths = [];
	param_data.id = 'token';
	
	var json = [];
	json.push("cancel_transfer_token_savings");
	
	var json_sub = {};
	json_sub.token = token;
	json_sub.from = from;
	json_sub.to = to;
	json_sub.request_id = reqId;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['active'] = active_key;
	
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

Token.concludeTransferTokenSavings = function(req,res) {
	var from = req.body.from;	
	var wif = req.body.wif;
	var token = req.body.token;
	var to = req.body.to;	
	var reqId = req.body.req_id;

	var active_key = common.get_private_key(from, wif, "active");

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [from];
	param_data.required_posting_auths = [];
	param_data.required_auths = [];
	param_data.id = 'token';
	
	var json = [];
	json.push("conclude_transfer_token_savings");
	
	var json_sub = {};
	json_sub.token = token;
	json_sub.from = from;
	json_sub.to = to;
	json_sub.request_id = reqId;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['active'] = active_key;
	
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

Token.getTokenSavingsWithdrawFrom = function(req,res){
	var tokenname = req.body.tokenname;	
	var from = req.body.from;

	var args = {};
	args.api = "token_api";
	args.func = "get_token_savings_withdraw_from";

	var param = [];

	param.push(tokenname);
	param.push(from);

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

Token.getTokenSavingsWithdrawTo = function(req,res){
	var tokenname = req.body.tokenname;	
	var to = req.body.to;

	var args = {};
	args.api = "token_api";
	args.func = "get_token_savings_withdraw_to";

	var param = [];

	param.push(tokenname);
	param.push(to);

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

Token.lookupTokenSavingsWithdraw = function(req,res){
	var tokenname = req.body.tokenname;	
	var from = req.body.from;
	var to = req.body.to
	var req_id = req.body.req_id;
	var count = req.body.count;

	var args = {};
	args.api = "token_api";
	args.func = "lookup_token_savings_withdraw";

	var param = [];

	if(from == null)
		from = "";
	if(to == null)
		to = "";
	if(req_id == null || req_id == "")
		req_id = 0;

	param.push(tokenname);
	param.push(from);
	param.push(to);
	param.push(req_id);
	param.push(count);

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


/**
 * for hard fork 0.3.0
 */
Token.voteTokenExchangeRate = function(req,res) {
	var token = req.body.name;
	var voter = req.body.voter;	
	var wif = req.body.wif;	

	var active_key = common.get_private_key(voter, wif, "active");
	
	var temp_price = req.body.price;	
	var symbol_name = req.body.symbol_name;

	var base_price = "";
	if(temp_price.indexOf('.') > -1) {
		var arr_price = temp_price.split(".");
		base_price = arr_price[0] + "." + common.rpad(arr_price[1],config.fee_string_rpad,"0"); 
	}else {
		base_price = temp_price + "." + common.rpad("",config.fee_string_rpad,"0"); 
	}
	base_price = base_price + " " + symbol_name;

	var exchange_rate = {};
	exchange_rate.base = base_price;
	exchange_rate.quote = "1.00000000 PIA";
	
	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [voter];
	param_data.required_posting_auths = [];
	param_data.required_auths = [];
	param_data.id = 'token';
	
	var json = [];
	json.push("vote_token_exchage_rate");
	
	var json_sub = {};
	json_sub.name = token;
	json_sub.voter = voter;
	json_sub.exchange_rate = exchange_rate;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['active'] = active_key;
	
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

module.exports = Token;