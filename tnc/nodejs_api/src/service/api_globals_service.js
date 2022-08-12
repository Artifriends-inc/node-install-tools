'use strict';

const config = require('../config/config.js');
const common = require('./api_common.js');

const rpc = require('../rpc/rpc.js');
const database = require('./database.js');

var Globals = {};

Globals.getGlobal = function(req,res){
	var func = req.body.func;
		
	var args = {};
	args.api = "database_api";
	args.func = func;
	
	args.param = [];
	
	args.callback = function(data){
		if(typeof data.connection != "undefined") {		
			data.rpc.close(data.connection);
		}
		delete data.rpc;
		delete data.connection;
		res.json(data);
	};

	database.doSearch(args);	
}

/*
Globals.getConfig = function(req,res){
	this.doAction(req,res,"database_api","get_config",[]);
};

Globals.getDynamicGlobal = function(req,res) {
	this.doAction(req,res,"database_api","get_dynamic_global_properties",[]);
};

Globals.getHardforkVersion = function(req,res) {
	this.doAction(req,res,"database_api","get_hardfork_version",[]);
};

Globals.getNextScheduledHardfork = function(req,res) {
	this.doAction(req,res,"database_api","get_next_scheduled_hardfork",[]);
};

Globals.doAction = function(req,res,api,func,param){
	var args = {};
	args.api = api;
	args.func = func;
	
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
}
*/
module.exports = Globals;