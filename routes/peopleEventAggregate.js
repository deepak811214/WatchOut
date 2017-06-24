'use strict';

module.exports = (server) => {

	/**
	 * POST with query params, handles single aggregated event  
	 */
	server.post({
		name: SINGLE_AGGREGATE_EVENT_POST,
		path: '/people/event/aggregate?entryCount=:entryCount&exitCount=:exitCount&eventTime=:eventTime'
	}, singleAggregateEventPost);
	
	/**
	 * POST with request body, handles multiple aggregated events  
	 */
	server.post({
		name: MULTIPLE_AGGREGATE_EVENTS_POST,
		path: '/people/event/aggregate'
	}, multipleAggregateEventsPost);
};

var utils = require('../common/util.js');
var mongoDao = require('../dao/eventDao.js');
var log = require('../logger/logger.js');
const SINGLE_AGGREGATE_EVENT_POST = 'singleAggregateEventPost';
const MULTIPLE_AGGREGATE_EVENTS_POST = 'multipleAggregateEventsPost';

var singleAggregateEventPost = (req, res, next) => {
	if(req.params.entryCount || req.params.exitCount) {
		var aggregateEventLog = {
			'in': (req.params.entryCount)? parseInt(req.params.entryCount) : 0,
			'out': (req.params.exitCount)? parseInt(req.params.exitCount) : 0,
			'eventTime': utils.getEventTime(req.params.eventTime)
		};
		mongoDao.addAnAggregateEvent(
			aggregateEventLog,
			() => {
				res.send(201);
				next(false);
			}, err => {
				res.send(500, err);
				next(false);
			}
		);
	} else {
		next(MULTIPLE_AGGREGATE_EVENTS_POST);
	}
};
singleAggregateEventPost.handlerName = SINGLE_AGGREGATE_EVENT_POST;

var multipleAggregateEventsPost = (req, res, next) => {
	if(req.body) {
		let aggregateEventLogs = new Array({});
		for(var aggregateEvent of req.body) {
			aggregateEventLogs.push({
				'in': aggregateEvent.entryCount,
				'out': aggregateEvent.exitCount,
				'eventTime': utils.getEventTime(aggregateEvent.eventTime)
			});
		}
		mongoDao.addAnArrayOfAggregateEvents(aggregateEventLogs, () => {
				res.send(201);
				next(false);
			}, err => {
				res.send(500, err);
				next(false);
			}
		);
	} else {
		res.send(400);
		next(false);
	}
};
multipleAggregateEventsPost.handlerName = MULTIPLE_AGGREGATE_EVENTS_POST;