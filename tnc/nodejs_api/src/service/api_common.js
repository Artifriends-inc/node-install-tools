'use strict';

var auth = require('../lib/auth');
var _auth2 = _interopRequireDefault(auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Common = {};

Common.lpad = function(s, padLength, padString){
 
    while(s.length < padLength)
        s = padString + s;
    return s;
}

 
Common.rpad = function(s, padLength, padString){
    while(s.length < padLength)
        s += padString;
    return s;
}

Common.random = function(start,scale){
	return Math.floor(Math.random() * scale) + start;
}

Common.get_private_key = function(account,pwd,role) {
	var wif = "";
	if(auth.isWif(pwd)) {
		wif = pwd;
	}else {
		wif = auth.toWif(account, pwd, role);
	}
	return wif;
}

module.exports = Common;