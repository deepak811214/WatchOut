'use strict';

module.exports = (server) => {

	/**
	 * POST with query params, handles single aggregated event  
	 */
	server.post({
		name: SINGLE_EVENT_POST,
		path: '/people/event?entryCount=:entryCount&exitCount=:exitCount&eventTime=:eventTime'
	}, singleEventPost);
	
	/**
	 * POST with request body, handles multiple aggregated events  
	 */
	server.post({
		name: MULTIPLE_EVENTS_POST,
		path: '/people/event'
	}, multipleEventsPost);
};

var utils = require('../common/util.js');
var mongoDao = require('../dao/eventDao.js');
var log = require('../logger/logger.js');
var websocket = require('../websocket/broadcast.js');
const SINGLE_EVENT_POST = 'singleEventPost';
const MULTIPLE_EVENTS_POST = 'multipleEventsPost';

var singleEventPost = (req, res, next) => {
	if(req.params.entryCount || req.params.exitCount) {
		var eventLog = {
			'entryCount': (req.params.entryCount)? parseInt(req.params.entryCount) : 0,
			'exitCount': (req.params.exitCount)? parseInt(req.params.exitCount) : 0,
			'eventTime': utils.getEventTime(req.params.eventTime)
		};
		mongoDao.addAnEvent(
			eventLog,
			() => {
				res.send(201);
				delete eventLog._id;
				websocket.broadcast([eventLog]);
				next(false);
			}, err => {
				res.send(500, err);
				next(false);
			}
		);
	} else {
		next(MULTIPLE_EVENTS_POST);
	}
};
singleEventPost.handlerName = SINGLE_EVENT_POST;

var multipleEventsPost = (req, res, next) => {
	if(req.body) {
		let eventLogs = new Array({});
		for(var event of req.body) {
			eventLogs.push({
				'entryCount': event.entryCount,
				'exitCount': event.exitCount,
				'eventTime': utils.getEventTime(event.eventTime)
			});
		}
		mongoDao.addAnArrayOfEvents(eventLogs, () => {
				res.send(201);
				eventLogs.forEach(eventLog => delete eventLog._id);
				websocket.broadcast(eventLogs);
				next(false);
			}, err => {
				res.send(500, err);
				next(false);
			}
		);
	} else if(req.params.entryCount || req.params.exitCount) {
		next(SINGLE_EVENT_POST);
	} else {
		res.send(400);
		next(false);
	}
};
multipleEventsPost.handlerName = MULTIPLE_EVENTS_POST;