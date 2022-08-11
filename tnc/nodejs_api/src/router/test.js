module.exports = function(app) {
	
	const config = require('../config/config.js');
	const util = require('../util/util');
	//const env =  (process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';
	var env = 'production';
	if(typeof config.mode != 'undefined') {
		env = config.mode;
	}

	app.get('/test',function(req,res){
		res.render('page/test', {
			title: "[" + env.toUpperCase()+ "] test :: " + util.getServerIp(),
            env:env,
			creator: config.creator,
			creator_wif: config.creator_wif
		})
	});

	app.get('/test/database',function(req,res){
		res.render('page/test/database', {
			title: "[" + env.toUpperCase()+ "] database :: " + util.getServerIp(),
			creator: config.creator,
			creator_wif: config.creator_wif
		})
	});

	app.get('/test/token_search',function(req,res){
		res.render('page/test/token_search', {
			title: "[" + env.toUpperCase()+ "] token_search :: " + util.getServerIp(),
			creator: config.creator,
			creator_wif: config.creator_wif
		})
	});	

	app.get('/test/tnc_rr_wallet',function(req,res){
		res.render('page/test/tnc_rr_wallet', {
			title: "[" + env.toUpperCase()+ "] tnc_rr_wallet :: " + util.getServerIp(),
			creator: config.creator,
			creator_wif: config.creator_wif
		})
	});	

	app.get('/test/tnc_ald_wallet',function(req,res){
		res.render('page/test/tnc_ald_wallet', {
			title: "[" + env.toUpperCase()+ "] tnc_ald_wallet :: " + util.getServerIp(),
			creator: config.creator,
			creator_wif: config.creator_wif
		})
	});	
	
	if(env == 'development') {
		app.get('/test/transaction',function(req,res){
			res.render('page/test/transaction', {
				title: "[" + env.toUpperCase()+ "] transaction :: " + util.getServerIp(),
				creator: config.creator,
				creator_wif: config.creator_wif,
				dapp_creator: config.dapp_creator,
				dapp_creator_wif: config.dapp_creator_wif
			})
		});		

		app.get('/test/token',function(req,res){
			res.render('page/test/token', {
				title: "[" + env.toUpperCase()+ "] token :: " + util.getServerIp(),
				creator: config.creator,
				creator_wif: config.creator_wif
			})
		});	

		app.get('/test/dapp',function(req,res){
			res.render('page/test/dapp', {
				title: "[" + env.toUpperCase()+ "] dapp :: " + util.getServerIp(),
				creator: config.creator,
				creator_wif: config.creator_wif
			})
		});	
		
	}

}
