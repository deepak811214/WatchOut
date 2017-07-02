'use strict';

module.exports = (server) => {

	/**
	 * GET with query params: startTime and endTime  
	 */
	server.get({
		name: GETTER_WITH_START_END_TIME,
		path: '/people/event/log?startTime=:startTime&endTime=:endTime'
	}, getterWithStartEndTime);

	/**
	 * Default GET on people event, gives todays entry/exist event  
	 */
	server.get({
		name: DEFAULT_PEOPLE_EVENT_GETTER,
		path: '/people/event/log'
	}, defaultPeopleEventGetter);

};

var mongoDao = require('../dao/eventDao.js');
var log = require('../logger/logger.js');
const DEFAULT_PEOPLE_EVENT_GETTER = 'defaultPeopleEventGetter';
const GETTER_WITH_START_END_TIME = 'eventGetterWithStartEndTime';

var defaultPeopleEventGetter = (req, res, next) => {
	var startTime = new Date();
	startTime.setHours(0,0,0,0); //setting time to midnight 12AM
	var endTime = new Date();
	mongoDao.getPeopleEventLog(startTime, endTime, peopleEvents => {
		res.send(200,peopleEvents);
		next(false);
	});
};
defaultPeopleEventGetter.handlerName = DEFAULT_PEOPLE_EVENT_GETTER;
var getterWithStartEndTime = (req, res, next) => {
	if(req.params.startTime && req.params.endTime) {
		mongoDao.getPeopleEventLog(new Date(req.params.startTime), new Date(req.params.endTime), 
			peopleEvents => {
				res.send(200,peopleEvents);
				next(false);
			});
	} else {
		next(DEFAULT_PEOPLE_EVENT_GETTER);
	}
};
getterWithStartEndTime.handlerName = GETTER_WITH_START_END_TIME;