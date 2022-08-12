module.exports.getIp = function(req,res) {
	
	var ip = "";
	try {
		ip = req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress;
		
		//console.log("client IP is *********************" + ip);   //::ffff:192.168.100.1    ::ffff:49.168.253.87
		ip = ip.replace('::ffff:','');
	}catch(e) {
		
	}
	return ip;
}


module.exports.getServerIp = function() {
	var os = require('os');
	var ifaces = os.networkInterfaces();
    var result = '';
    for (var dev in ifaces) {
        var alias = 0;
        ifaces[dev].forEach(function(details) {
            if (details.family == 'IPv4' && details.internal === false) {
                result = details.address;
                ++alias;
            }
        });
    }
  
    return result;
}
