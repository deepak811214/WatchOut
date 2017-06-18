'use strict';

module.exports = {
	mongoDo : whatToDo => {
		mongoClient.connect(url, (err, db) => {
			assertNull(err);
			whatToDo(db,() => db.close());
		});
	},
	assert: err => assertNull(err) 
};


var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/watchOut';
var log = require('../logger/logger.js');

var assertNull = (err) => {
	if(err) {
		log.error(err);
		throw err;
	}
};