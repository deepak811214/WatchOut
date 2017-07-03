'use strict';

module.exports = (server) => {

	/**
	 * Default GET on people count graph, gives todays entry/exist count at one hour interval 
	 */
	server.get({
		name: PEOPLE_COUNT_GRAPH,
		path: '/people/count/graph'
	}, peopleCountGraph);

};

var mongoDao = require('../dao/eventDao.js');
var log = require('../logger/logger.js');
const PEOPLE_COUNT_GRAPH = 'peopleCountGraph';

var peopleCountGraph = (req, res, next) => {
	var startTime = new Date();
	startTime.setHours(0,0,0,0); //setting time to midnight 12AM
	var endTime = new Date();
	mongoDao.getAggregatedPeopleCount(startTime, endTime, peopleCount => {
		res.send(200,peopleCount);
		next(false);
	});
};
peopleCountGraph.handlerName = PEOPLE_COUNT_GRAPH;