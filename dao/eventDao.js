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
	}

};

var log = require('../logger/logger.js');
var dao = require('./dao.js');
const LOG = 'log';

var mongoDo = dao.mongoDo.bind(dao);
var assert = dao.assert.bind(dao);