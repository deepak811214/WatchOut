'use strict';

module.exports = {
	//Opens websocket connection
	openWebsocket: server => {
		wss = new WebSocket.Server({server});
		wss.on('open', function open() {
		  console.log('Websocket connected!');
		});

		wss.on('close', function close() {
		  console.log('Websocket disconnected!');
		});
	},
	
	// Broadcast to all.
	broadcast : data => {
		wss.clients.forEach(client => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(data));
			}
		});
	},

	closeWebsocket: () => wss.close()
};

var mongoDao = require('../dao/eventDao.js');
var log = require('../logger/logger.js');

/** 
 * WebSocket Server, used to push latest updates the clients
 */
const WebSocket = require('ws');
var wss;