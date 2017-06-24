'use strict';

module.exports = (server) => {

	/**
	 * POST with query params, handles single event  
	 */
	server.post({
		name: SINGLE_EVENT_POST,
		path: '/people/event?event=:event&eventTime=:eventTime'
	}, singleEventPost);
	
	/**
	 * POST with request body, handles multiple events  
	 */
	server.post({
		name: MULTIPLE_EVENTS_POST,
		path: '/people/event'
	}, multipleEventsPost);
};

var utils = require('../common/util.js');
var mongoDao = require('../dao/eventDao.js');
var log = require('../logger/logger.js');
const SINGLE_EVENT_POST = 'singleEventPost';
const MULTIPLE_EVENTS_POST = 'multipleEventsPost';

var singleEventPost = (req, res, next) => {
	if(req.params.event) {
		mongoDao.addAnEvent(req.params.event, utils.getEventTime(req.params.eventTime),
			() => {
				res.send(201);
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
				'event': event.event,
				'eventTime': utils.getEventTime(event.eventTime)
			});
		}
		mongoDao.addAnArrayOfEvents(eventLogs, () => {
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
multipleEventsPost.handlerName = MULTIPLE_EVENTS_POST;