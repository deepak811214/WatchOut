'use strict';

module.exports = (server) => {

	/**
	 * GET with query params: startTime and endTime  
	 */
	server.get({
		name: GETTER_WITH_START_END_TIME,
		path: '/people/count/aggregate?startTime=:startTime&endTime=:endTime'
	}, getterWithStartEndTime);

	/**
	 * Default GET on people count, gives todays entry/exist count  
	 */
	server.get({
		name: DEFAULT_PEOPLE_COUNT_GETTER,
		path: '/people/count/aggregate'
	}, defaultPeopleCountGetter);

};

var mongoDao = require('../dao/eventDao.js');
var log = require('../logger/logger.js');
const DEFAULT_PEOPLE_COUNT_GETTER = 'defaultPeopleCountAggregateGetter';
const GETTER_WITH_START_END_TIME = 'aggregateGetterWithStartEndTime';

var defaultPeopleCountGetter = (req, res, next) => {
	var startTime = new Date();
	startTime.setHours(0,0,0,0); //setting time to midnight 12AM
	var endTime = new Date();
	mongoDao.getPeopleCountFromAggregateEvents(startTime, endTime, peopleCount => {
		res.send(200,peopleCount);
		next(false);
	});
};
defaultPeopleCountGetter.handlerName = DEFAULT_PEOPLE_COUNT_GETTER;
var getterWithStartEndTime = (req, res, next) => {
	if(req.params.startTime && req.params.startTime) {
		mongoDao.getPeopleCountFromAggregateEvents(new Date(req.params.startTime), new Date(req.params.endTime), 
			peopleCount => {
				res.send(200,peopleCount);
				next(false);
			});
	} else {
		next(DEFAULT_PEOPLE_COUNT_GETTER);
	}
};
getterWithStartEndTime.handlerName = GETTER_WITH_START_END_TIME;