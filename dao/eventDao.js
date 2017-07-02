'use strict';

module.exports = {
    // gets people count between the given start and end time from events log
	getPeopleCountFromEvents: (startTime, endTime, callBack) => {
		mongoDo((db, next) => {
			var peopleCount = {
				entryCount: 0,
				exitCount: 0
			};
			var cursor = db.collection(LOG).aggregate([
				{ $match: { 'eventTime': { $gte: startTime, $lte :endTime }} },
		        { $group: { '_id': null , 'entryCount': { $sum: '$entryCount' }, 'exitCount': {$sum : '$exitCount'} } }
		    ]);
		    cursor.toArray((err, resultSet) => {
		       	assert(err);
		       	if(resultSet[0]) {
					peopleCount.entryCount = resultSet[0].entryCount;
					peopleCount.exitCount = resultSet[0].exitCount;
		       	}
		       	next();
				callBack(peopleCount);
		    });
		});
	},
	// gets people event log between the given start and end time from events log
	getPeopleEventLog: (startTime, endTime, callBack) => {
		mongoDo((db, next) => {
			var cursor = db.collection(LOG).find({'eventTime': { $gte: startTime, $lte :endTime }}, {'_id':0});
		    cursor.toArray((err, resultSet) => {
		       	assert(err);
		       	next();
				callBack(resultSet);
		    });
		});
	},
	// adds an event into the log 
	addAnEvent: (eventLog, callBack, errCallBack) => {
		mongoDo((db, next) => {
			db.collection(LOG).insertOne(eventLog, (err, result) => {
				assert(err);
				next();
				if(result.insertedCount === 1) {
				 	callBack();
				} else {
					errCallBack('Failed to save the data!');
				}
			});
		});
	},
	// add array of events
	addAnArrayOfEvents: (eventLogs, callBack, errCallBack) => {
		mongoDo((db, next) => {	
			db.collection(LOG).insertMany(eventLogs, (err, result) => {
				assert(err);
				next();
				if(eventLogs.length === result.insertedCount) {
					callBack();
				} else {
					errCallBack(result.insertedCount + 'records inserted!');
				}
			});
		});
	}

};

var log = require('../logger/logger.js');
var dao = require('./dao.js');
const LOG = 'log';

var mongoDo = dao.mongoDo.bind(dao);
var assert = dao.assert.bind(dao);