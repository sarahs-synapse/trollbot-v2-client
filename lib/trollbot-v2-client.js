/**
 * This just provides a convenience library to connect
 * to the main trollbot daemon.
 */
module.exports = function(hostname, port, secret, options) {
	var self = this;

	self.socketsio = require('socket.io-client');

	self.hostname = hostname;
	self.port     = port;
	
	self.secret   = secret;
	self.options  = options;

	self.tsock    = false;

	self.getTSock = function(cb) {
		if (self.tsock)
		{
			cb(false, self.tsock);
			return true;																					
		}																								
																										
		self.connectTSock(cb);																		
																										
		return true;																						
	}																									

	self.connectTSock = function(cb) {
		var client = self.socketsio.connect('tcp://' + self.hostname + ':' + self.port, function( err ) {
			if (err)
				console.error(err);
		});

		client.on('connect', function() {
			// TODO: Identify self client
			self.tsock = client;
			client.emit('client-connect', { shared_secret: self.secret });

			cb(false, client);
		});

		client.on('error', function(err) {
			console.error(err);
		});

		return client;
	}
};
