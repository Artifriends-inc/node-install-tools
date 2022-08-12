'use strict';

const config = require('../config/config.js');
const common = require('./api_common.js');

const formatter = require('../lib/formatter');
const utils = require('../lib/utils.js');

var FormatterAndUtil = {};

FormatterAndUtil.createSuggestedPassword = function(req,res) {
	var res_data = {};
	res_data.result = formatter.createSuggestedPassword();
	
	res.json(res_data);	
};

FormatterAndUtil.commentPermlink = function(req,res) {
	var parentAuthor = req.body.parentAuthor;
	var parentPermlink  = req.body.parentPermlink ;

	var res_data = {};
	res_data.result = formatter.commentPermlink(parentAuthor, parentPermlink);
	
	res.json(res_data);	
};


FormatterAndUtil.reputation = function(req,res) {
	var amount = req.body.amount;
	
	var res_data = {};
	res_data.result = formatter.reputation(amount);
	
	res.json(res_data);	
};

FormatterAndUtil.validateAccountName = function(req,res) {
	var account = req.body.account;
	
	var res_data = {};
	res_data.result = utils.validateAccountName(account);
	
	res.json(res_data);	
};

module.exports = FormatterAndUtil;