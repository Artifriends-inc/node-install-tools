'use strict';

const config = require('../config/config.js');
const common = require('./api_common.js');

const rpc = require('../rpc/rpc.js');
const database = require('./database.js');

var Block = {};

Block.getTransaction = function(req,res) {
	var transaction_id = req.body.transaction_id;

	var args = {};
	args.api = "database_api";
	args.func = "get_transaction";
	var param = [];
	param.push(transaction_id);
	args.param = param;

	args.callback = function(data){
		if(typeof data.connection != "undefined") {		
			data.rpc.close(data.connection);
		}
		delete data.connection;
		delete data.rpc;
	
		res.json(data);
	};

	database.doSearch(args);

};

Block.getBlockHeader = function(req,res) {
	var blockNum = req.body.blockNum;


	var args = {};
	args.api = "database_api";
	args.func = "get_block_header";
	var param = [];
	param.push(blockNum);
	args.param = param;

	args.callback = function(data){
		if(typeof data.connection != "undefined") {		
			data.rpc.close(data.connection);
		}
		delete data.connection;
		delete data.rpc;
	
		res.json(data);
	};

	database.doSearch(args);

};

Block.getBlock = function(req,res) {
	var blockNum = req.body.blockNum;

	var callback = function(data){
		if(typeof data.connection != "undefined") {		
			data.rpc.close(data.connection);
		}
		delete data.connection;
		delete data.rpc;
	
		res.json(data);
	};

	this.getBlockInfo(blockNum,callback);
	
};

Block.getBlocks = function(req,res) {

	var blockInfos = [];

	var blockNums = req.body.blockNums;	
	var blockNums = JSON.parse(blockNums);
	
	var index = 0;
	var blockNum = blockNums[index]; 

	var callback = function(data){
		
		if(typeof data.connection != "undefined") {
			var connection = data.connection;
			var rpc = data.rpc;
			delete data.rpc;
			delete data.connection;
			blockInfos.push(data);
			//console.log("index :: " + index  + " blockNum :: " + blockNum  + " length :: " + blockNums.length );
			index++;

			
			if( index == blockNums.length ){
				rpc.close(connection);
				res.json(blockInfos);
			}else {
				blockNum = blockNums[index]; 
				Block.getBlockInfo(blockNum,callback,connection);
			}
		}else {
			delete data.connection;
			delete data.rpc;
		
			res.json(data);
		}
	};

	this.getBlockInfo(blockNum,callback);
};

Block.getBlockInfo = function(blockNum,callback,connection = null){
	var args = {}; //console.log("connection :: " + connection);
	args.connection = connection;	

	args.api = "database_api";
	args.func = "get_block";
	
	var param = [];
	param.push(blockNum);
	args.param = param;
	args.callback = callback;

	database.doSearch(args);
}

Block.getCategories = function(req,res) {
	var after = req.body.after;
	var limit = req.body.limit;
	var func = req.body.func;

	var args = {};
	args.api = "database_api";
	args.func = func;
	var param = [];
	param.push({after:after,limit:limit});
	
	args.param = param;

	args.callback = function(data){
		if(typeof data.connection != "undefined") {		
			data.rpc.close(data.connection);
		}
		delete data.connection;
		delete data.rpc;
	
		res.json(data);
	};

	database.doSearch(args);

};

module.exports = Block;