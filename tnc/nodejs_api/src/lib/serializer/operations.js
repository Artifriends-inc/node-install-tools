"use strict";

var config = require('../../config/config');
var version = config.version;
var type_lib = "./types";
var _types = require(type_lib);

var _types2 = _interopRequireDefault(_types);

var _serializer = require("./serializer");

var _serializer2 = _interopRequireDefault(_serializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uint16 = _types2.default.uint16,
    uint32 = _types2.default.uint32,
    uint8 = _types2.default.uint8,
    uint64 = _types2.default.uint64,
    string = _types2.default.string,
    string_binary = _types2.default.string_binary,
    bytes = _types2.default.bytes,
    bool = _types2.default.bool,
    array = _types2.default.array,
    static_variant = _types2.default.static_variant,
    map = _types2.default.map,
    set = _types2.default.set,
    public_key = _types2.default.public_key,
    time_point_sec = _types2.default.time_point_sec,
    optional = _types2.default.optional,
    asset = _types2.default.asset;


var future_extensions = _types2.default.void;
var hardfork_version_vote = _types2.default.void;
var version = _types2.default.void;
var bproducer_owner = _types2.default.void;

var operation = static_variant();
module.exports.operation = operation;

// For module.exports
var Serializer = function Serializer(operation_name, serilization_types_object) {
    var s = new _serializer2.default(operation_name, serilization_types_object);
    return module.exports[operation_name] = s;
};

// Custom-types after Generated code

// ##  Generated code follows
// -------------------------------
/*
When updating generated code (fix closing notation)
Replace:  var operation = static_variant([
with:     operation.st_operations = [

Delete (these are custom types instead):
let public_key = new Serializer( 
    "public_key",
    {key_data: bytes(33)}
);

let asset = new Serializer( 
    "asset",
    {amount: int64,
    symbol: uint64}
);

Replace: authority.prototype.account_authority_map
With: map((string), (uint16))
*/
var signed_transaction = new Serializer("signed_transaction", {
    ref_block_num: uint16,
    ref_block_prefix: uint32,
    expiration: time_point_sec,
    operations: array(operation),
    extensions: set(future_extensions),
    signatures: array(bytes(65))
});

var signed_block = new Serializer("signed_block", {
    previous: bytes(20),
    timestamp: time_point_sec,
    witness: string,
    transaction_merkle_root: bytes(20),
    extensions: set(static_variant([future_extensions, version, hardfork_version_vote, bproducer_owner])),
    witness_signature: bytes(65),
    transactions: array(signed_transaction)
});

var block_header = new Serializer("block_header", {
    previous: bytes(20),
    timestamp: time_point_sec,
    witness: string,
    transaction_merkle_root: bytes(20),
    extensions: set(static_variant([future_extensions, version, hardfork_version_vote, bproducer_owner]))
});

var signed_block_header = new Serializer("signed_block_header", {
    previous: bytes(20),
    timestamp: time_point_sec,
    witness: string,
    transaction_merkle_root: bytes(20),
    extensions: set(static_variant([future_extensions, version, hardfork_version_vote, bproducer_owner])),
    witness_signature: bytes(65)
});

var price = new Serializer("price", {
    base: asset,
    quote: asset
});

var authority = new Serializer("authority", {
    weight_threshold: uint32,
    account_auths: map(string, uint16),
    key_auths: map(public_key, uint16)
});

var chain_properties = new Serializer("chain_properties", {
    account_creation_fee: asset,
    maximum_block_size: uint32,
    sbd_interest_rate: uint16
});

var transfer = new Serializer("transfer", {
    from: string,
    to: string,
    amount: asset,
    memo: string
});

var account_create = new Serializer("account_create", {
    creator: string,
    new_account_name: string,
    owner: authority,
    active: authority,
    posting: authority,
    memo_key: public_key,
    json_metadata: string
});

var account_update = new Serializer("account_update", {
    account: string,
    owner: optional(authority),
    active: optional(authority),
    posting: optional(authority),
    memo_key: public_key,
    json_metadata: string
});

var bobserver_update = new Serializer("bobserver_update", {
    root: string,
    owner: string,
    url: string,
    block_signing_key: public_key
});

var custom = new Serializer("custom", {
    required_auths: set(string),
    id: uint16,
    data: bytes()
});

var custom_json = new Serializer("custom_json", {
    required_auths: set(string),
    required_posting_auths: set(string),
    id: string,
    json: string
});

var request_account_recovery = new Serializer("request_account_recovery", {
    recovery_account: string,
    account_to_recover: string,
    new_owner_authority: authority,
    extensions: set(future_extensions)
});

var recover_account = new Serializer("recover_account", {
    account_to_recover: string,
    new_owner_authority: authority,
    recent_owner_authority: authority,
    extensions: set(future_extensions)
});

var change_recovery_account = new Serializer("change_recovery_account", {
    account_to_recover: string,
    new_recovery_account: string,
    extensions: set(future_extensions)
});

var custom_binary = new Serializer("custom_binary", {
    required_owner_auths: set(string),
    required_active_auths: set(string),
    required_posting_auths: set(string),
    required_auths: array(authority),
    id: string,
    data: bytes()
});

var decline_voting_rights = new Serializer("decline_voting_rights", {
    account: string,
    decline: bool
});

var reset_account = new Serializer("reset_account", {
    reset_account: string,
    account_to_reset: string,
    new_owner_authority: authority
});

var set_reset_account = new Serializer("set_reset_account", {
    account: string,
    current_reset_account: string,
    reset_account: string
});

var update_bproducer = new Serializer("update_bproducer", {
    root: string,
    bobserver: string,
    approve: bool
});

var except_bobserver = new Serializer("except_bobserver", {
    root: string,
    bobserver: string
});

var account_auth = new Serializer("account_auth", {
    account: string,
    auth_type: string,
    auth_token: string
});

var shutdown_bobserver = new Serializer("shutdown_bobserver", { 
    owner: string 
});

var hardfork = new Serializer("hardfork", { 
    hardfork_id: uint32 
});

var print = new Serializer("print", { 
    root: string,
	account: string,
	amount: asset
});

var burn = new Serializer("burn", { 
    root: string,
	account: string,
	amount: asset
});

var dapp_fee_virtual = new Serializer("dapp_fee_virtual", { 
    dapp_name: string,
	reward: asset
});

var dapp_reward_virtual = new Serializer("dapp_reward_virtual", { 
    account: string,
	reward: asset
});

var fill_token_staking_fund = new Serializer("fill_token_staking_fund", { 
    from: string,
	token: string,
	fund_name: string,
	amount: asset,
	request_id: uint32,
	memo : string
});

var fill_transfer_token_savings = new Serializer("fill_transfer_token_savings", { 
    from: string,
	to: string,
	token: string,
	request_id: uint32,
	amount: asset,
	total_amount: asset,
	fund_name: string,
	split_pay_order : uint8,
	split_pay_month : uint8,
	memo : string
});

var custom_json_dapp = new Serializer("custom_json_dapp", { 
    required_owner_auths: set(string),
	required_active_auths: set(string),
    required_posting_auths: set(string),
	required_auths: array(authority),
    id: string,
    json: string
});

var transfer_savings = new Serializer("transfer_savings", {
    from: string,
    request_id: uint32,
    to: string,
    amount: asset,
    total_amount: asset,
    split_pay_order: uint8,
    split_pay_month: uint8,
    memo: string,
    complete: time_point_sec
});

var cancel_transfer_savings = new Serializer("cancel_transfer_savings", {
    root: string,
    from: string,
    request_id: uint32
});

var conclusion_transfer_savings = new Serializer("conclusion_transfer_savings", {
    root: string,
    from: string,
    request_id: uint32
});

var staking_fund = new Serializer("staking_fund", {
    from: string,
    fund_name: string,
    request_id: uint32,
    amount: asset,
    memo: string,
    usertype: uint8,
    month: uint8
});

var conclusion_staking = new Serializer("conclusion_staking", {
    root: string,
    from: string,
    fund_name: string,
    request_id: uint32
});

var fill_staking_fund = new Serializer("fill_staking_fund", {
    from: string,
    fund_name: string,
    amount: asset,
    request_id: uint32,
    memo: string
});

var transfer_fund = new Serializer("transfer_fund", {
    from: string,
    fund_name: string,
    amount: asset,
    memo: string
});

var set_fund_interest = new Serializer("set_fund_interest", {
    root: string,
    fund_name: string,
    usertype: uint8,
    month: uint8,
    percent_interest: string
});

var fill_staking_fund = new Serializer("fill_staking_fund", {
    from: string,
    fund_name: string,
    amount: asset,
    request_id: uint32,
    memo: string
});

var return_staking_fund = new Serializer("return_staking_fund", {
    root: string,
    fund_name: string,
    request_id: uint32,
    to: string
});

var fill_transfer_savings = new Serializer("fill_transfer_savings", {
    from: string,
    to: string,
    amount: asset,
    total_amount: asset,
    split_pay_order: uint8,
    split_pay_month: uint8,
	request_id: uint32,
    memo: string,
});

operation.st_operations = 
	[
		transfer,
		account_create,
		account_update,
		bobserver_update,
		custom,
		custom_json,
		request_account_recovery,
		recover_account,
		change_recovery_account,
		custom_binary,
		decline_voting_rights,
		reset_account,
		set_reset_account,
		update_bproducer,
		except_bobserver,
		account_auth,
		print,
		burn,
		transfer_savings,
		cancel_transfer_savings,
		conclusion_transfer_savings,
		staking_fund,
		conclusion_staking,
		transfer_fund,
		set_fund_interest,
		return_staking_fund,
		shutdown_bobserver,
		hardfork,
		dapp_fee_virtual,
		dapp_reward_virtual,
		fill_token_staking_fund,
		fill_transfer_token_savings,
		fill_staking_fund,
        fill_transfer_savings,

		custom_json_dapp
	];

var transaction = new Serializer("transaction", {
    ref_block_num: uint16,
    ref_block_prefix: uint32,
    expiration: time_point_sec,
    operations: array(operation),
    extensions: set(future_extensions)
});

//# -------------------------------
//#  Generated code end  S T O P
//# -------------------------------

// Custom Types (do not over-write)

var encrypted_memo = new Serializer("encrypted_memo", { from: public_key,
    to: public_key,
    nonce: uint64,
    check: uint32,
    encrypted: string_binary });
/*

// Make sure all tests pass

npm test

*/