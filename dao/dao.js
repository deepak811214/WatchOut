'use strict';

module.exports = {
	getPeopleCount: (startTime, endTime, callBack) => {
		mongoDo((db, next) => {
			var peopleCount = {
				entryCount: 0,
				exitCount: 0
			};
			var cursor =db.collection('log').find({ "eventTime": { $gte: startTime, $lte :endTime }});
			cursor.each(function(err, doc) {
				if(err) {
					log.error(err);
					throw err;
				}
				if(doc) {
					switch(doc.even) {
						case 'in':
							peopleCount.entryCount++;
							break;
						case 'out':
							peopleCount.exitCount++;
							break;
						default: log.info("Unknown event!");
					}
				} else {
					next();
					callBack(peopleCount);
				}
			});
		});
	}
};

var mongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/watchOut';
var log = require('../logger/logger.js');
var Q = require('q');

function mongoDo(whatToDo) {
	mongoClient.connect(url, (err, db) => {
		if(err) {
			log.error(err);
			throw err;
		}
		whatToDo(db,() => db.close());
	});
}