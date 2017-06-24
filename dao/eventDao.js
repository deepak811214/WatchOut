'use strict';

module.exports = {
	// gets people count between the given start and end time
	getPeopleCount: (startTime, endTime, callBack) => {
		mongoDo((db, next) => {
			var peopleCount = {
				entryCount: 0,
				exitCount: 0
			};
			var cursor = db.collection(LOG).aggregate([
				{ $match: { 'eventTime': { $gte: startTime, $lte :endTime }} },
		        { $group: { '_id': '$event' , 'count': { $sum: 1 } } }
		    ]);
		    cursor.toArray((err, events) => {
		       	assert(err);
				for(var event of events) {
		       		switch(event._id) {
		       			case 'in':
		       				peopleCount.entryCount = event.count;
		       				break;
		       			case 'out':
		       				peopleCount.exitCount = event.count;
		       				break;
		       			default: log.info("unidentified event!");
		       		}
		       	}
		       	next();
				callBack(peopleCount);
		    });
		});
	},
	// gets people count between the given start and end time from aggregate event log
	getPeopleCountFromAggregateEvents: (startTime, endTime, callBack) => {
		mongoDo((db, next) => {
			var peopleCount = {
				entryCount: 0,
				exitCount: 0
			};
			var cursor = db.collection(AGGREGATE_LOG).aggregate([
				{ $match: { 'eventTime': { $gte: startTime, $lte :endTime }} },
		        { $group: { '_id': null , 'entryCount': { $sum: '$in' }, 'exitCount': {$sum : '$out'} } }
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
	// adds an event into the log 
	addAnEvent: (event, eventTime, callBack, errCallBack) => {
		mongoDo((db, next) => {
			db.collection(LOG).insertOne({
				'event' : event,
				'eventTime' : eventTime
			}, (err, result) => {
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
	addAnArrayOfEvents: (events, callBack, errCallBack) => {
		mongoDo((db, next) => {
			db.collection(LOG).insertMany(events, (err, result) => {
				assert(err);
				next();
				if(events.length === result.insertedCount) {
					callBack();
				} else {
					errCallBack(result.insertedCount + 'records inserted!');
				}
			});
		});
	},
	// adds an aggregate event into the log 
	addAnAggregateEvent: (aggregateEventLog, callBack, errCallBack) => {
		mongoDo((db, next) => {
			console.log(aggregateEventLog);
			db.collection(AGGREGATE_LOG).insertOne(aggregateEventLog, (err, result) => {
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
	// add array of aggregate events
	addAnArrayOfAggregateEvents: (aggregateEventLogs, callBack, errCallBack) => {
		mongoDo((db, next) => {
			console.log(aggregateEventLogs);	
			db.collection(AGGREGATE_LOG).insertMany(aggregateEventLogs, (err, result) => {
				assert(err);
				next();
				if(aggregateEventLogs.length === result.insertedCount) {
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
const AGGREGATE_LOG = 'aggregatedLog';

var mongoDo = dao.mongoDo.bind(dao);
var assert = dao.assert.bind(dao);