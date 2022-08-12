module.exports = function(app)
{

	const api_global = require('../service/api_globals_service');
	const api_block = require('../service/api_block_service');
	const api_auth = require('../service/api_auth_service');
	const api_accounts = require('../service/api_accounts_service');
	const api_formatter_util = require('../service/api_formatter_util_service');
	const api = require('../service/api_service');
	const api_transfer = require('../service/api_transfer_service');
	
	const api_token = require('../service/api_token_service');
	const api_dapp = require('../service/api_dapp_service');

	const api_rr_wallet = require('../service/api_rr_wallet');
	const api_ald_wallet = require('../service/api_ald_wallet');

	app.post('/api/getTransaction',function(req,res){
		api_block.getTransaction(req,res);
	});

	app.post('/api/getConfig',function(req,res){
		req.body.func = "get_config";
		api_global.getGlobal(req,res);
	});

	app.post('/api/getDynamicGlobal',function(req,res){
		req.body.func = "get_dynamic_global_properties";
		api_global.getGlobal(req, res);
	});

	app.post('/api/getHardforkVersion',function(req,res){
		req.body.func = "get_hardfork_version";
		api_global.getGlobal(req, res);
	});

	app.post('/api/getNextScheduledHardfork',function(req,res){
		req.body.func = "get_next_scheduled_hardfork";
		api_global.getGlobal(req, res);
	});

	app.post('/api/getBlockHeader',function(req,res){
		api_block.getBlockHeader(req, res);
	});

	app.post('/api/getBlock',function(req,res){
		api_block.getBlock(req, res);
	});

	app.post('/api/getBlocks',function(req,res){
		api_block.getBlocks(req, res);
	});

	app.post('/api/toWif',function(req,res){
		api_auth.toWif(req, res);
	});

	app.post('/api/isWif',function(req,res){
		api_auth.isWif(req, res);
	});
	
	app.post('/api/wifIsValid',function(req,res){
		api_auth.wifIsValid(req, res);
	});
	
	app.post('/api/wifToPublic',function(req,res){
		api_auth.wifToPublic(req, res);
	});

	app.post('/api/generateKeys',function(req,res){
		api_auth.generateKeys(req, res);
	});

	app.post('/api/getPrivateKeys',function(req,res){
		api_auth.getPrivateKeys(req, res);
	});

	app.post('/api/login',function(req,res){
		api_accounts.checkAccount(req,res);
	});	

	app.post('/api/getAccounts',function(req,res){
		api_accounts.getAccounts(req,res);
	});

	app.post('/api/getAccount',function(req,res){
		api_accounts.getAccount(req,res);
	});

	app.post('/api/lookupAccountNames',function(req,res){
		api_accounts.lookupAccountNames(req,res);
	});

	app.post('/api/lookupAccounts',function(req,res){
		api_accounts.lookupAccounts(req,res);
	});

	app.post('/api/getAccountCount',function(req,res){
		api_accounts.getAccountCount(req,res);
	});

	app.post('/api/getAccountHistory',function(req,res){
		api_accounts.getAccountHistory(req,res);
	});

	app.post('/api/getOwnerHistory',function(req,res){
		api_accounts.getOwnerHistory(req,res);
	});

	app.post('/api/getRecoveryRequest',function(req,res){
		api_accounts.getRecoveryRequest(req,res);
	});

	app.post('/api/lookupBpAccounts',function(req,res){
		api_accounts.lookupBpAccounts(req,res);
	});

	app.post('/api/lookupBoAccounts',function(req,res){
		api_accounts.lookupBoAccounts(req,res);
	});

	app.post('/api/getBobyAccount',function(req,res){
		api_accounts.getBobyAccount(req,res);
	});

	app.post('/api/getAuthToken',function(req,res){
		api_accounts.getAuthToken(req,res);
	});

	app.post('/api/getAuthTokenList',function(req,res){
		api_accounts.getAuthTokenList(req,res);
	});

	app.post('/api/transfer',function(req,res){
		api_transfer.transfer(req, res);
	});

	app.post('/api/createAccount',function(req,res){
		api.createAccount(req, res);
	});

	app.post('/api/updateAccount',function(req,res){
		api.updateAccount(req, res);
	});

	app.post('/api/setAuthToken',function(req,res){
		api.setAuthToken(req, res);
	});

	app.post('/api/updateBobserver',function(req,res){
		api.updateBobserver(req, res);
	});

	app.post('/api/exceptBobserver',function(req,res){
		api.exceptBobserver(req, res);
	});

	app.post('/api/updateBproducer',function(req,res){
		api.updateBproducer(req, res);
	});


	app.post('/api/burn',function(req,res){
		api_transfer.burn(req, res);
	});


	app.post('/api/print',function(req,res){
		api_transfer.print(req, res);
	});

	app.post('/api/createDapp',function(req,res){
		api_dapp.createDapp(req, res);
	});

	app.post('/api/updateDappKey',function(req,res){
		api_dapp.updateDappKey(req, res);
	});

	app.post('/api/commentDapp',function(req,res){
		api_dapp.commentDapp(req, res);
	});

	app.post('/api/deleteCommentDapp',function(req,res){
		api_dapp.deleteCommentDapp(req, res);
	});

	app.post('/api/VoteCommentDapp',function(req,res){
		api_dapp.VoteCommentDapp(req, res);
	});

	app.post('/api/getDapp',function(req,res){
		api_dapp.getDapp(req, res);
	});

	app.post('/api/lookupDapps',function(req,res){
		api_dapp.lookupDapps(req, res);
	});

	app.post('/api/getDappsByOwner',function(req,res){
		api_dapp.getDappsByOwner(req, res);
	});

	app.post('/api/getDappContent',function(req,res){
		api_dapp.getDappContent(req, res);
	});

	app.post('/api/getDappContentReplies',function(req,res){
		api_dapp.getDappContentReplies(req, res);
	});
	
	app.post('/api/lookupDappContents',function(req,res){
		api_dapp.lookupDappContents(req, res);
	});
	
	app.post('/api/joinDapp',function(req,res){
		api_dapp.joinDapp(req, res);
	});

	app.post('/api/leaveDapp',function(req,res){
		api_dapp.leaveDapp(req, res);
	});

	app.post('/api/lookupDappUsers',function(req,res){
		api_dapp.lookupDappUsers(req, res);
	});
   
	app.post('/api/getJoinDapps',function(req,res){
		api_dapp.getJoinDapps(req, res);
	});

	app.post('/api/voteDapp',function(req,res){
		api_dapp.voteDapp(req, res);
	});

	app.post('/api/voteDappActive', function (req, res) {
		api_dapp.voteDappActive(req, res);
	});

	app.post('/api/voteDappTrxFee', function (req, res) {
		api_dapp.voteDappTrxFee(req, res);
	});
   
	app.post('/api/getDappVotes',function(req,res){
		api_dapp.getDappVotes(req, res);
	});

	app.post('/api/getDappHistory',function(req,res){
		api_dapp.getDappHistory(req,res);
	});


	app.post('/api/createToken',function(req,res){
		api_token.createToken(req, res);
	});

	app.post('/api/issueToken',function(req,res){
		api_token.issueToken(req, res);
	});

	app.post('/api/transferToken',function(req,res){
		api_token.transferToken(req, res);
	});

	app.post('/api/burnToken',function(req,res){
		api_token.burnToken(req, res);
	});

	app.post('/api/setupTokenFund', function (req, res) {
		api_token.setupTokenFund(req, res);
	});

	app.post('/api/setTokenStakingInterest', function (req, res) {
		api_token.setTokenStakingInterest(req, res);
	});

	app.post('/api/transferTokenFund', function (req, res) {
		api_token.transferTokenFund(req, res);
	});

	app.post('/api/stakingTokenFund', function (req, res) {
		api_token.stakingTokenFund(req, res);
	});

	app.post('/api/transferTokenSavings', function (req, res) {
		api_token.transferTokenSavings(req, res);
	});

	app.post('/api/cancelTransferTokenSavings', function (req, res) {
		api_token.cancelTransferTokenSavings(req, res);
	});

	app.post('/api/concludeTransferTokenSavings', function (req, res) {
		api_token.concludeTransferTokenSavings(req, res);
	});

	app.post('/api/voteTokenExchangeRate', function (req, res) {
		api_token.voteTokenExchangeRate(req, res);
	});

	app.post('/api/getToken',function(req,res){
		api_token.getToken(req, res);
	});

	app.post('/api/LookUpTokens',function(req,res){
		api_token.LookUpTokens(req, res);
	});

	app.post('/api/getTokenBalance',function(req,res){
		api_token.getTokenBalance(req, res);
	});

	app.post('/api/getAccountsByToken',function(req,res){
		api_token.getAccountsByToken(req, res);
	});

	app.post('/api/getTokensByDapp',function(req,res){
		api_token.getTokensByDapp(req, res);
	});

	app.post('/api/getTokenFund',function(req,res){
		api_token.getTokenFund(req, res);
	});

	app.post('/api/getTokenStakingInterest',function(req,res){
		api_token.getTokenStakingInterest(req, res);
	});

	app.post('/api/getTokenStakingList',function(req,res){
		api_token.getTokenStakingList(req, res);
	});

	app.post('/api/lookupTokenFundWithdraw',function(req,res){
		api_token.lookupTokenFundWithdraw(req, res);
	});

	app.post('/api/getTokenSavingsWithdrawFrom',function(req,res){
		api_token.getTokenSavingsWithdrawFrom(req, res);
	});

	app.post('/api/getTokenSavingsWithdrawTo',function(req,res){
		api_token.getTokenSavingsWithdrawTo(req, res);
	});

	app.post('/api/lookupTokenSavingsWithdraw',function(req,res){
		api_token.lookupTokenSavingsWithdraw(req, res);
	});

	app.post('/api/writePurchase',function(req,res){
		api_dapp.writePurchase(req, res);
	});

	app.post('/api/writePurchase',function(req,res){
		api_dapp.writePurchase(req, res);
	});

	app.post('/api/registerDirectAD',function(req,res){
		api_dapp.registerDirectAD(req, res);
	});

	app.post('/api/registerMissioinAD',function(req,res){
		api_dapp.registerMissioinAD(req, res);
	});

	app.post('/api/joinAD',function(req,res){
		api_dapp.joinAD(req, res);
	});

	app.post('/api/enjoyDirectAD',function(req,res){
		api_dapp.enjoyDirectAD(req, res);
	});

	app.post('/api/enjoyMissionAD',function(req,res){
		api_dapp.enjoyMissionAD(req, res);
	});

	app.post('/api/acceptMissionAD',function(req,res){
		api_dapp.acceptMissionAD(req, res);
	});

	app.post('/api/tnc_rr_create_wallet',function(req,res){
		api_rr_wallet.createTNCWallet(req, res);
	});

	app.post('/api/tnc_rr_get_wallet_address',function(req,res){
		api_rr_wallet.getTNCAddress(req, res);
	});

	app.post('/api/tnc_rr_update_wallet_key',function(req,res){
		api_rr_wallet.updateTNCWallet(req, res);
	});

	app.post('/api/tnc_rr_transfer',function(req,res){
		api_rr_wallet.transferTNCWallet(req, res);
	});

	app.post('/api/tnc_rr_staking_info',function(req,res){
		api_rr_wallet.stakingInfo(req, res);
	});

	app.post('/api/tnc_rr_staking_fund',function(req,res){
		api_rr_wallet.stakingTNCFund(req, res);
	});

	app.post('/api/tnc_rr_transfer_fund',function(req,res){
		api_rr_wallet.transferTNCFund(req, res);
	});

	app.post('/api/tnc_rr_get_staking_fund_from',function(req,res){
		api_rr_wallet.getTNCStakingFundFrom(req, res);
	});

	app.post('/api/tnc_rr_get_staking_fund_list',function(req,res){
		api_rr_wallet.getTNCStakingFundList(req, res);
	});

	app.post('/api/tnc_rr_get_wallet_history',function(req,res){
		api_rr_wallet.getTNCWalletHistory(req, res);
	});

	app.post('/api/tnc_rr_get_wallet_info',function(req,res){
		api_rr_wallet.getTNCWalletInfo(req, res);
	});

	app.post('/api/tnc_rr_transfer_lock',function(req,res){
		api_rr_wallet.transferLockTNCWallet(req, res);
	});

	app.post('/api/tnc_rr_get_transfer_lock_from',function(req,res){
		api_rr_wallet.getTransferLockFrom(req, res);
	});

	app.post('/api/tnc_rr_get_transfer_lock_to',function(req,res){
		api_rr_wallet.getTransferLockTo(req, res);
	});

	app.post('/api/tnc_rr_check_wallet',function(req,res){
		api_rr_wallet.checkAccount(req, res);
	});


	app.post('/api/tnc_ald_create_wallet',function(req,res){
		api_ald_wallet.createTNCWallet(req, res);
	});

	app.post('/api/tnc_ald_get_wallet_address',function(req,res){
		api_ald_wallet.getTNCAddress(req, res);
	});

	app.post('/api/tnc_ald_update_wallet_key',function(req,res){
		api_ald_wallet.updateTNCWallet(req, res);
	});

	app.post('/api/tnc_ald_transfer',function(req,res){
		api_ald_wallet.transferTNCWallet(req, res);
	});

	app.post('/api/tnc_ald_staking_info',function(req,res){
		api_ald_wallet.stakingInfo(req, res);
	});

	app.post('/api/tnc_ald_staking_fund',function(req,res){
		api_ald_wallet.stakingTNCFund(req, res);
	});

	app.post('/api/tnc_ald_transfer_fund',function(req,res){
		api_ald_wallet.transferTNCFund(req, res);
	});

	app.post('/api/tnc_ald_get_staking_fund_from',function(req,res){
		api_ald_wallet.getTNCStakingFundFrom(req, res);
	});

	app.post('/api/tnc_ald_get_staking_fund_list',function(req,res){
		api_ald_wallet.getTNCStakingFundList(req, res);
	});

	app.post('/api/tnc_ald_get_wallet_history',function(req,res){
		api_ald_wallet.getTNCWalletHistory(req, res);
	});

	app.post('/api/tnc_ald_get_wallet_info',function(req,res){
		api_ald_wallet.getTNCWalletInfo(req, res);
	});

	app.post('/api/tnc_ald_transfer_lock',function(req,res){
		api_ald_wallet.transferLockTNCWallet(req, res);
	});

	app.post('/api/tnc_ald_get_transfer_lock_from',function(req,res){
		api_ald_wallet.getTransferLockFrom(req, res);
	});

	app.post('/api/tnc_ald_get_transfer_lock_to',function(req,res){
		api_ald_wallet.getTransferLockTo(req, res);
	});

	app.post('/api/tnc_ald_check_wallet',function(req,res){
		api_ald_wallet.checkAccount(req, res);
	});
}

