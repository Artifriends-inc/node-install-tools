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

var Dapp = {};

var _bluebird = require('bluebird');
var _bluebird2 = _interopRequireDefault(_bluebird);

var auth = require('../lib/auth');
var _auth2 = _interopRequireDefault(auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if(config.testnet) {
	Dapp.createDapp = function(req,res) {
		
		var owner = req.body.owner;
		var pwd = req.body.pwd;
		var dapp_name = req.body.dapp_name;
		var dapp_pwd = common.random(1,9)+""+common.random(1,9)+""+common.random(1,9)+""+common.random(1,9)+""+common.random(1,9)+""+common.random(1,9);

		var private_key = auth.toWif(owner, dapp_pwd, "active");
		var public_key = auth.generateKeys(owner, dapp_pwd, ['active'])['active'];
		
		var sign_key = common.get_private_key(owner, pwd, "active");

		var trx = {};
		var operations = [];
		var operations_sub = [];
		operations_sub.push("custom_json_dapp");
		
		var param_data = {};

		param_data.required_owner_auths = [];
		param_data.required_active_auths = [owner];	
		param_data.required_posting_auths = [];
		param_data.required_auths = [];
		param_data.id = "dapp";
		
		var json = [];
		json.push("create_dapp");
		
		var json_sub = {};
		json_sub.owner = owner;
		json_sub.dapp_name = dapp_name;
		json_sub.dapp_key = public_key;
		json.push(json_sub);
		
		param_data.json = JSON.stringify(json);

		operations_sub.push(param_data);
		operations.push(operations_sub);

		trx.operations = operations;
		
		var keys = {};
		keys['active'] = sign_key; 
		
		var args = {};
		args.trx = trx;
		args.keys = keys;
		args.callback = function(data){
			if(typeof data.connection != "undefined") {		
				data.rpc.close(data.connection);
			}
			delete data.rpc;
			delete data.connection;
			
			data.private_key = private_key;
			res.json(data);
		};
		
		broadcast.doTrx(args);

	};

	Dapp.updateDappKey = function(req,res) {

		var owner = req.body.owner;
		var pwd = req.body.pwd;
		var dapp_name = req.body.dapp_name;
		var dapp_pwd = common.random(1,9)+""+common.random(1,9)+""+common.random(1,9)+""+common.random(1,9)+""+common.random(1,9)+""+common.random(1,9);
		
		var private_key = auth.toWif(owner, dapp_pwd, "active");
		var public_key = auth.generateKeys(owner, dapp_pwd, ['active'])['active'];
		
		var sign_key = common.get_private_key(owner, pwd, "active");

		var trx = {};
		var operations = [];
		var operations_sub = [];
		operations_sub.push("custom_json_dapp");
		
		var param_data = {};

		param_data.required_owner_auths = [];
		param_data.required_active_auths = [owner];	
		param_data.required_posting_auths = [];
		param_data.required_auths = [];
		param_data.id = "dapp";
		
		var json = [];
		json.push("update_dapp_key");
		
		var json_sub = {};
		json_sub.owner = owner;
		json_sub.dapp_name = dapp_name;
		json_sub.dapp_key = public_key;
		json.push(json_sub);
		
		param_data.json = JSON.stringify(json);

		operations_sub.push(param_data);
		operations.push(operations_sub);

		trx.operations = operations;
		
		var keys = {};
		keys['active'] = sign_key;
		
		var args = {};
		args.trx = trx;
		args.keys = keys;
		args.callback = function(data){
			if(typeof data.connection != "undefined") {		
				data.rpc.close(data.connection);
			}
			delete data.rpc;
			delete data.connection;
			
			data.private_key = private_key;
			res.json(data);
		};
		
		broadcast.doTrx(args);

	};
} else {
	Dapp.createDapp = function(req,res) {
		
		var owner = req.body.owner;
		var pwd = req.body.pwd; //config.dapp_creator_wif;
		var dapp_name = req.body.dapp_name;
		var dapp_pwd = common.random(1,9)+""+common.random(1,9)+""+common.random(1,9)+""+common.random(1,9)+""+common.random(1,9)+""+common.random(1,9);

		var private_key = auth.toWif(owner, dapp_pwd, "active");
		var public_key = auth.generateKeys(owner, dapp_pwd, ['active'])['active'];
		
		var sign_key = "";
		if(auth.isWif(pwd)) {
			sign_key = pwd;
		}else {
			sign_key = auth.toWif(owner, pwd, "active");
		}
		// var sign_key = common.get_private_key(owner, pwd, "active");
      
		var trx = {};
		var operations = [];
		var operations_sub = [];
		operations_sub.push("custom_json_dapp");
		
		var param_data = {};

		param_data.required_owner_auths = [];
		param_data.required_active_auths = [owner];	
		param_data.required_posting_auths = [];
		param_data.required_auths = [];
		param_data.id = "dapp";
		
		var json = [];
		json.push("create_dapp");
		
		var json_sub = {};
		json_sub.owner = owner;
		json_sub.dapp_name = dapp_name;
		json_sub.dapp_key = public_key;
		json.push(json_sub);
		
		param_data.json = JSON.stringify(json);

		operations_sub.push(param_data);
		operations.push(operations_sub);

		trx.operations = operations;
		
		var keys = {};
		keys['active'] = sign_key;
		
		var args = {};
		args.trx = trx;
		args.keys = keys;
		args.callback = function(data){
			if(typeof data.connection != "undefined") {
				data.rpc.close(data.connection);
			}
			delete data.rpc;
			delete data.connection;
			// console.log(data);
			
			data.private_key = private_key;
			res.json(data);
		};
		
		broadcast.doTrx(args);

	};

	Dapp.updateDappKey = function(req,res) {
		var owner = req.body.owner;
		var pwd = req.body.pwd; //config.dapp_creator_wif;
		var dapp_name = req.body.dapp_name;
		var dapp_pwd = common.random(1,9)+""+common.random(1,9)+""+common.random(1,9)+""+common.random(1,9)+""+common.random(1,9)+""+common.random(1,9);

		var private_key = auth.toWif(owner, dapp_pwd, "active");
		var public_key = auth.generateKeys(owner, dapp_pwd, ['active'])['active'];

		var sign_key = "";
		if(auth.isWif(pwd)) {
			sign_key = pwd;
		}else {
			sign_key = auth.toWif(owner, pwd, "active");
		}
		// var sign_key = common.get_private_key(owner, pwd, "active");

		var trx = {};
		var operations = [];
		var operations_sub = [];
		operations_sub.push("custom_json_dapp");
		
		var param_data = {};

		param_data.required_owner_auths = [];
		param_data.required_active_auths = [owner];	
		param_data.required_posting_auths = [];
		param_data.required_auths = [];
		param_data.id = "dapp";
		
		var json = [];
		json.push("update_dapp_key");
		
		var json_sub = {};
		json_sub.owner = owner;
		json_sub.dapp_name = dapp_name;
		json_sub.dapp_key = public_key;
		json.push(json_sub);
		
		param_data.json = JSON.stringify(json);

		operations_sub.push(param_data);
		operations.push(operations_sub);

		trx.operations = operations;
		
		var keys = {};
		keys['active'] = sign_key;
		
		var args = {};
		args.trx = trx;
		args.keys = keys;
		args.callback = function(data){
			if(typeof data.connection != "undefined") {		
				data.rpc.close(data.connection);
			}
			delete data.rpc;
			delete data.connection;
			// console.log(data);
			
			data.private_key = private_key;
			res.json(data);
		};
		
		broadcast.doTrx(args);

	};
}

Dapp.commentDapp = function(req,res) {
		
	var dapp_name = req.body.dapp_name;
	var parent_author = req.body.parent_author;
	var parent_permlink = req.body.parent_permlink;
	var author = req.body.author;
	var pwd = req.body.pwd;	
	var permlink = req.body.permlink;
	var title = req.body.title;
	var body = req.body.body;
	var json_meta = req.body.json_meta;
	
	var sign_key = "";
	if(auth.isWif(pwd)) {
		sign_key = pwd;
	}else {
		sign_key = auth.toWif(author, pwd, "posting");
	}
	// var sign_key = common.get_private_key(author, pwd, "posting");

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [];
	param_data.required_posting_auths = [author];
	param_data.required_auths = [];
	param_data.id = "dapp";
	
	var json = [];
	json.push("comment_dapp");
	
	var json_sub = {};
	json_sub.dapp_name = dapp_name;
	json_sub.parent_author = parent_author;
	json_sub.parent_permlink = parent_permlink;
	json_sub.author = author;
	json_sub.permlink = permlink;
	json_sub.title = title;
	json_sub.body = body;
	json_sub.json_meta = json_meta;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['posting'] = sign_key;
	
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

Dapp.deleteCommentDapp = function(req,res) {
		
	var dapp_name = req.body.dapp_name;
	var author = req.body.author;
	var pwd = req.body.pwd;	
	var permlink = req.body.permlink;
	
	var sign_key = "";
	if(auth.isWif(pwd)) {
		sign_key = pwd;
	}else {
		sign_key = auth.toWif(author, pwd, "posting");
	}
	// var sign_key = common.get_private_key(author, pwd, "posting");

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [];
	param_data.required_posting_auths = [author];
	param_data.required_auths = [];
	param_data.id = "dapp";
	
	var json = [];
	json.push("delete_comment_dapp");
	
	var json_sub = {};
	json_sub.dapp_name = dapp_name;
	json_sub.author = author;
	json_sub.permlink = permlink;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['posting'] = sign_key;
	
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

Dapp.VoteCommentDapp = function(req,res) {
		
	var dapp_name = req.body.dapp_name;
	var voter = req.body.voter;
	var author = req.body.author;
	var pwd = req.body.pwd;	
	var permlink = req.body.permlink;
	var voteType = req.body.vote_type;
	
	var sign_key = "";
	if(auth.isWif(pwd)) {
		sign_key = pwd;
	}else {
		sign_key = auth.toWif(voter, pwd, "posting");
	}

	// var sign_key = common.get_private_key(voter, pwd, "posting");

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [];
	param_data.required_posting_auths = [voter];
	param_data.required_auths = [];
	param_data.id = "dapp";
	
	var json = [];
	json.push("comment_vote_dapp");
	
	var json_sub = {};
	json_sub.dapp_name = dapp_name;
	json_sub.voter = voter;
	json_sub.author = author;
	json_sub.permlink = permlink;
	json_sub.vote_type = parseInt(voteType);;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['posting'] = sign_key;
	
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

Dapp.getDapp = function(req,res){
	var dappnames = req.body.dappnames;	
	dappnames = JSON.parse(dappnames);
	
	var args = {};
	args.api = "dapp_api";
	args.func = "get_dapp";

	var param = [];
	//var subparam = [];
	for(var i=0;i<dappnames.length;i++){
		param.push(dappnames[i]);
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

Dapp.lookupDapps = function(req,res){
	var dappnames = req.body.dappnames;	
	dappnames = JSON.parse(dappnames);

	var count = req.body.count;
	
	var args = {};
	args.api = "dapp_api";
	args.func = "lookup_dapps";

	var param = [];
	//var subparam = [];
	for(var i=0;i<dappnames.length;i++){
		param.push(dappnames[i]);
	}
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


Dapp.getDappsByOwner = function(req,res){
	var owners = req.body.owners;	
	owners = JSON.parse(owners);

	
	var args = {};
	args.api = "dapp_api";
	args.func = "get_dapps_by_owner";

	var param = [];
	//var subparam = [];
	for(var i=0;i<owners.length;i++){
		param.push(owners[i]);
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

Dapp.getDappContent = function(req,res){
	
	var dapp_name = req.body.dapp_name;
	var author = req.body.author;
	var permlink = req.body.permlink;
	
	var args = {};
	args.api = "dapp_api";
	args.func = "get_dapp_content";

	var param = [];
	param.push(dapp_name);
	param.push(author);
	param.push(permlink);

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

Dapp.getDappContentReplies = function(req,res){
	
	var dapp_name = req.body.dapp_name;
	var author = req.body.author;
	var permlink = req.body.permlink;
	
	var args = {};
	args.api = "dapp_api";
	args.func = "get_dapp_content_replies";

	var param = [];
	param.push(dapp_name);
	param.push(author);
	param.push(permlink);

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

Dapp.lookupDappContents = function(req,res){

	var dapp_name = req.body.dapp_name;
	var last_author = req.body.last_author;
	var last_permlink = req.body.last_permlink;
	var limit = req.body.limit;
	
	var args = {};
	args.api = "dapp_api";
	args.func = "lookup_dapp_contents";

	var param = [];
	param.push(dapp_name);
	param.push(last_author);
	param.push(last_permlink);
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

Dapp.joinDapp = function(req,res){

	var account_name = req.body.account_name;
	var dapp_name = req.body.dapp_name;
	var pwd = req.body.pwd;	
	
	var sign_key = "";
	if(auth.isWif(pwd)) {
		sign_key = pwd;
	} else {
		sign_key = auth.toWif(account_name, pwd, "active");
	}

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [account_name];
	param_data.required_posting_auths = [];
	param_data.required_auths = [];
	param_data.id = "dapp";
	
	var json = [];
	json.push("join_dapp");
	
	var json_sub = {};
	json_sub.account_name = account_name;
	json_sub.dapp_name = dapp_name;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['active'] = sign_key;
	
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

Dapp.leaveDapp = function(req,res){

	var account_name = req.body.account_name;
	var dapp_name = req.body.dapp_name;
	var pwd = req.body.pwd;	
	
	var sign_key = "";
	if(auth.isWif(pwd)) {
		sign_key = pwd;
	} else {
		sign_key = auth.toWif(account_name, pwd, "active");
	}

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [account_name];
	param_data.required_posting_auths = [];
	param_data.required_auths = [];
	param_data.id = "dapp";
	
	var json = [];
	json.push("leave_dapp");
	
	var json_sub = {};
	json_sub.account_name = account_name;
	json_sub.dapp_name = dapp_name;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['active'] = sign_key;
	
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

Dapp.lookupDappUsers = function(req,res){

	var dapp_name = req.body.dapp_name;
	var users = req.body.users;
	var limit = req.body.limit;
	
	var args = {};
	args.api = "dapp_api";
	args.func = "lookup_dapp_users";

	var param = [];
	param.push(dapp_name);
	param.push(users);
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

Dapp.getJoinDapps = function(req,res){
	
	var account_name = req.body.account_name;
	
	var args = {};
	args.api = "dapp_api";
	args.func = "get_join_dapps";

	var param = [];
	param.push(account_name);

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

Dapp.voteDapp = function(req,res){

	var voter = req.body.voter;
	var pwd = req.body.pwd;	
	var dapp_name = req.body.dapp_name;
	var vote = req.body.vote;

	var sign_key = "";
	if(auth.isWif(pwd)) {
		sign_key = pwd;
	} else {
		sign_key = auth.toWif(voter, pwd, "active");
	}

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [voter];
	param_data.required_posting_auths = [];
	param_data.required_auths = [];
	param_data.id = "dapp";
	
	var json = [];
	json.push("vote_dapp");
	
	var json_sub = {};
	json_sub.voter = voter;
	json_sub.dapp_name = dapp_name;
	json_sub.vote = parseInt(vote, 10);
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['active'] = sign_key;
	
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

Dapp.voteDappActive = function(req,res){
	var voter = req.body.voter;
	var pwd = req.body.pwd;	
	var dapp_name = req.body.dapp_name;
	var vote = req.body.vote;

	var sign_key = "";
	if(auth.isWif(pwd)) {
		sign_key = pwd;
	} else {
		sign_key = auth.toWif(voter, pwd, "active");
	}

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [voter];
	param_data.required_posting_auths = [];
	param_data.required_auths = [];
	param_data.id = "dapp";
	
	var json = [];
	json.push("vote_dapp_active");
	
	var json_sub = {};
	json_sub.voter = voter;
	json_sub.dapp_name = dapp_name;
	json_sub.vote = parseInt(vote, 10);
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['active'] = sign_key;
	
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

Dapp.voteDappTrxFee = function(req,res){
	var voter = req.body.voter;
	var pwd = req.body.pwd;	
	var temp_fee = req.body.fee;

	var sign_key = "";
	if(auth.isWif(pwd)) {
		sign_key = pwd;
	} else {
		sign_key = auth.toWif(voter, pwd, "active");
	}

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [voter];
	param_data.required_posting_auths = [];
	param_data.required_auths = [];
	param_data.id = "dapp";
	
	var json = [];
	json.push("vote_dapp_trx_fee");

	var fee = "";
	if(temp_fee.indexOf('.') > -1) {
		var arr_fee = temp_fee.split(".");
		fee = arr_fee[0] + "." + common.rpad(arr_fee[1], config.snac_string_rpad,"0"); 
	} else {
		fee = temp_fee + "." + common.rpad("", config.snac_string_rpad,"0"); 
	}
	fee = fee + " " + config.snac_string;
	
	var json_sub = {};
	json_sub.voter = voter;
	json_sub.trx_fee = fee;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['active'] = sign_key;
	
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

Dapp.getDappVotes = function(req,res){
	
	var dapp_name = req.body.dapp_name;
	
	var args = {};
	args.api = "dapp_api";
	args.func = "get_dapp_votes";

	var param = [];
	param.push(dapp_name);

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

Dapp.getDappHistory = function(req,res){
	var dappName = req.body.dapp_name;
	var from = req.body.from;
	var limit = req.body.limit;

	var args = {};
	args.api = "dapp_history_api";
	args.func = "get_dapp_history";

	var param = [];
	param.push(dappName);
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

Dapp.writePurchase = function(req,res) {

	var author = req.body.author;
	var pwd = req.body.pwd;
	var permlink = req.body.permlink;
	var dapp_name = req.body.dapp_name;
	var title = "writePurchase";

	var product = req.body.product;
	var price = req.body.price;
	var img_url = req.body.img_url;

	var data = {};
	data.product = product;
	data.price = price;
	data.img_url = img_url;
	var body = JSON.stringify(data);
	
	var json_meta = "";
	
	var sign_key = "";
	if(auth.isWif(pwd)) {
		sign_key = pwd;
	}else {
		sign_key = auth.toWif(author, pwd, "posting");
	}
	// var sign_key = common.get_private_key(author, pwd, "posting");

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [];
	param_data.required_posting_auths = [author];
	param_data.required_auths = [];
	param_data.id = "dapp";
	
	var json = [];
	json.push("comment_dapp");
	
	var json_sub = {};
	json_sub.dapp_name = dapp_name;
	json_sub.parent_author = "";
	json_sub.parent_permlink = "";
	json_sub.author = author;
	json_sub.permlink = permlink;
	json_sub.title = title;
	json_sub.body = body;
	json_sub.json_meta = json_meta;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['posting'] = sign_key;
	
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

Dapp.registerDirectAD = function(req,res) {

	var author = req.body.author;
	var pwd = req.body.pwd;
	var permlink = req.body.permlink;
	var dapp_name = req.body.dapp_name;
	var title = "registerDirectAD";

	var data = {};
	data.title = req.body.title;
	data.body = req.body.body;
	data.total_price = req.body.total_price
	data.per_price = req.body.per_price;
	data.limit_day = req.body.limit_day;
	data.main_img = req.body.main_img;
	data.ad_img = req.body.ad_img;
	data.vod = req.body.vod;
	data.link = req.body.link;
	var body = JSON.stringify(data);
	
	var json_meta = "";
	
	var sign_key = "";
	if(auth.isWif(pwd)) {
		sign_key = pwd;
	}else {
		sign_key = auth.toWif(author, pwd, "posting");
	}
	// var sign_key = common.get_private_key(author, pwd, "posting");

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [];
	param_data.required_posting_auths = [author];
	param_data.required_auths = [];
	param_data.id = "dapp";
	
	var json = [];
	json.push("comment_dapp");
	
	var json_sub = {};
	json_sub.dapp_name = dapp_name;
	json_sub.parent_author = "";
	json_sub.parent_permlink = "";
	json_sub.author = author;
	json_sub.permlink = permlink;
	json_sub.title = title;
	json_sub.body = body;
	json_sub.json_meta = json_meta;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['posting'] = sign_key;
	
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

Dapp.registerMissioinAD = function(req,res) {

	var author = req.body.author;
	var pwd = req.body.pwd;
	var permlink = req.body.permlink;
	var dapp_name = req.body.dapp_name;
	var title = "registerMissioinAD";

	var data = {};
	data.title = req.body.title;
	data.body = req.body.body;
	data.type = req.body.type;
	data.total_price = req.body.total_price
	data.per_price = req.body.per_price;
	data.limit_day = req.body.limit_day;
	data.main_img = req.body.main_img;
	data.ad_img = req.body.ad_img;
	data.vod = req.body.vod;
	data.link = req.body.link;
	var body = JSON.stringify(data);
	
	var json_meta = "";
	
	var sign_key = "";
	if(auth.isWif(pwd)) {
		sign_key = pwd;
	}else {
		sign_key = auth.toWif(author, pwd, "posting");
	}
	// var sign_key = common.get_private_key(author, pwd, "posting");

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [];
	param_data.required_posting_auths = [author];
	param_data.required_auths = [];
	param_data.id = "dapp";
	
	var json = [];
	json.push("comment_dapp");
	
	var json_sub = {};
	json_sub.dapp_name = dapp_name;
	json_sub.parent_author = "";
	json_sub.parent_permlink = "";
	json_sub.author = author;
	json_sub.permlink = permlink;
	json_sub.title = title;
	json_sub.body = body;
	json_sub.json_meta = json_meta;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['posting'] = sign_key;
	
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

Dapp.joinAD = function(req,res) {

	var author = req.body.author;
	var pwd = req.body.pwd;
	var parent_permlink = req.body.ad_permlink;
	var parent_author = req.body.ad_author;
	var permlink = req.body.permlink;
	var dapp_name = req.body.dapp_name;
	var title = "joinAD";
	var body = "joinAD";
	
	var json_meta = "";
	
	var sign_key = "";
	if(auth.isWif(pwd)) {
		sign_key = pwd;
	}else {
		sign_key = auth.toWif(author, pwd, "posting");
	}
	// var sign_key = common.get_private_key(author, pwd, "posting");

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [];
	param_data.required_posting_auths = [author];
	param_data.required_auths = [];
	param_data.id = "dapp";
	
	var json = [];
	json.push("comment_dapp");
	
	var json_sub = {};
	json_sub.dapp_name = dapp_name;
	json_sub.parent_author = parent_author;
	json_sub.parent_permlink = parent_permlink;
	json_sub.author = author;
	json_sub.permlink = permlink;
	json_sub.title = title;
	json_sub.body = body;
	json_sub.json_meta = json_meta;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['posting'] = sign_key;
	
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

Dapp.enjoyDirectAD = function(req,res) {

	var author = req.body.author;
	var pwd = req.body.pwd;
	var parent_permlink = req.body.ad_permlink;
	var parent_author = req.body.ad_author;
	var permlink = req.body.permlink;
	var dapp_name = req.body.dapp_name;
	var title = "enjoyDirectAD";
	var data = {};
	data.price = req.body.price;
	var body = JSON.stringify(data);
	
	var json_meta = "";
	
	var sign_key = "";
	if(auth.isWif(pwd)) {
		sign_key = pwd;
	}else {
		sign_key = auth.toWif(author, pwd, "posting");
	}
	// var sign_key = common.get_private_key(author, pwd, "posting");

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [];
	param_data.required_posting_auths = [author];
	param_data.required_auths = [];
	param_data.id = "dapp";
	
	var json = [];
	json.push("comment_dapp");
	
	var json_sub = {};
	json_sub.dapp_name = dapp_name;
	json_sub.parent_author = parent_author;
	json_sub.parent_permlink = parent_permlink;
	json_sub.author = author;
	json_sub.permlink = permlink;
	json_sub.title = title;
	json_sub.body = body;
	json_sub.json_meta = json_meta;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['posting'] = sign_key;
	
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

Dapp.enjoyMissionAD = function(req,res) {

	var author = req.body.author;
	var pwd = req.body.pwd;
	var parent_permlink = req.body.ad_permlink;
	var parent_author = req.body.ad_author;
	var permlink = req.body.permlink;
	var dapp_name = req.body.dapp_name;
	var title = "enjoyMissionAD";
	var data = {};
	data.img = req.body.img;
	var body = JSON.stringify(data);
	
	var json_meta = "";
	
	var sign_key = "";
	if(auth.isWif(pwd)) {
		sign_key = pwd;
	}else {
		sign_key = auth.toWif(author, pwd, "posting");
	}
	// var sign_key = common.get_private_key(author, pwd, "posting");

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [];
	param_data.required_posting_auths = [author];
	param_data.required_auths = [];
	param_data.id = "dapp";
	
	var json = [];
	json.push("comment_dapp");
	
	var json_sub = {};
	json_sub.dapp_name = dapp_name;
	json_sub.parent_author = parent_author;
	json_sub.parent_permlink = parent_permlink;
	json_sub.author = author;
	json_sub.permlink = permlink;
	json_sub.title = title;
	json_sub.body = body;
	json_sub.json_meta = json_meta;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['posting'] = sign_key;
	
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

Dapp.acceptMissionAD = function(req,res) {

	var author = req.body.author;
	var pwd = req.body.pwd;
	var parent_permlink = req.body.ad_permlink;
	var parent_author = req.body.ad_author;
	var permlink = req.body.permlink;
	var dapp_name = req.body.dapp_name;
	var title = "acceptMissionAD";
	var data = {};
	data.enjoy_permlink = req.body.enjoy_permlink;
	data.state = req.body.state;
	data.price = req.body.price;
	var body = JSON.stringify(data);
	
	var json_meta = "";
	
	var sign_key = "";
	if(auth.isWif(pwd)) {
		sign_key = pwd;
	}else {
		sign_key = auth.toWif(author, pwd, "posting");
	}
	// var sign_key = common.get_private_key(author, pwd, "posting");

	var trx = {};
	var operations = [];
	var operations_sub = [];
	operations_sub.push("custom_json_dapp");
	
	var param_data = {};

	param_data.required_owner_auths = [];
	param_data.required_active_auths = [];
	param_data.required_posting_auths = [author];
	param_data.required_auths = [];
	param_data.id = "dapp";
	
	var json = [];
	json.push("comment_dapp");
	
	var json_sub = {};
	json_sub.dapp_name = dapp_name;
	json_sub.parent_author = parent_author;
	json_sub.parent_permlink = parent_permlink;
	json_sub.author = author;
	json_sub.permlink = permlink;
	json_sub.title = title;
	json_sub.body = body;
	json_sub.json_meta = json_meta;
	json.push(json_sub);
	
	param_data.json = JSON.stringify(json);

	operations_sub.push(param_data);
	operations.push(operations_sub);

	trx.operations = operations;
	
	var keys = {};
	keys['posting'] = sign_key;
	
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

// Dapp.executeQuery = function(req,res) {
	
// 	var active_key = req.body.dapp_private_key;
	
// 	var dapp_name = req.body.dapp_name;
// 	var dapp_key = req.body.dapp_key;      //dapp public key
// 	var query_sender = req.body.query_sender;
// 	var query = req.body.query;
	
// 	var trx = {};
// 	var operations = [];
// 	var operations_sub = [];
// 	operations_sub.push("custom_binary");
	
// 	var param_data = {};

// 	param_data.required_owner_auths = [];
// 	param_data.required_active_auths = [];
// 	param_data.required_posting_auths = [];
// 	param_data.required_auths = [
// 	{
// 		weight_threshold: 1,
// 		account_auths: [],
// 		key_auths: [[dapp_key, 1]]
// 	}];

// 	param_data.id = 'dapp_db';

// 	var ByteBuffer = require("bytebuffer");

// 	var len_buffer = new ByteBuffer();
// 	var data_buffer = new ByteBuffer();
	
// 	var string_type = _types.string; 
// 	var unit16_type = _types.uint16;

// 	var public_key_type = _types.public_key;
	
// 	unit16_type.appendByteBuffer(len_buffer,1); //1은 일단 고정
// 	len_buffer.flip();
// 	len_buffer.reverse(); //reverse

// 	string_type.appendByteBuffer(data_buffer,dapp_name);
// 	public_key_type.appendByteBuffer(data_buffer,dapp_key);
// 	string_type.appendByteBuffer(data_buffer,query_sender);
// 	string_type.appendByteBuffer(data_buffer,query);
// 	data_buffer.flip();

// 	param_data.data = len_buffer.toHex()+data_buffer.toHex();

// 	operations_sub.push(param_data);
// 	operations.push(operations_sub);

// 	trx.operations = operations;
	
// 	var keys = {};
// 	keys['active'] = active_key; 
	
// 	var args = {};
// 	args.trx = trx;
// 	args.keys = keys;//console.log(JSON.stringify(args));
// 	args.callback = function(data){
// 		if(typeof data.connection != "undefined") {		
// 			data.rpc.close(data.connection);
// 		}
// 		delete data.rpc;
// 		delete data.connection;

// 		res.json(data);
// 	};
	
// 	broadcast.doTrx(args);

	
// };

// Dapp.selectQuery = function(req,res) {
// 	var query = req.body.query;
// 	//var query = "select * from dapp_lighttiger_table1 ";
	
// 	var args = {};
// 	args.api = "dapp_db_api";
// 	args.func = "exec_select";

// 	var param = [];
// 	param.push(query);

// 	args.param = param;

// 	args.callback = function(data){
// 		if(typeof data.connection != "undefined") {		
// 			data.rpc.close(data.connection);
// 		}
// 		delete data.rpc;
// 		delete data.connection;
// 		res.json(data);
// 	};

// 	database.doSearch(args);
// }	


module.exports = Dapp;