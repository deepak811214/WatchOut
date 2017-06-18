'use strict';

module.exports = (server) => {
	server.get('/people/count',(req, res, next) => {
		var startTime = new Date();
		startTime.setHours(0,0,0,0); //setting time to midnight 12AM
		var endTime = new Date();
		mongoDao.getPeopleCount(startTime, endTime, (peopleCount) => {
			res.send(200,peopleCount);
		});
		return next();
	});

	server.post('/people/count', function create(req, res, next) {
	   res.send(201, "success");
	   mongoDao.testConnection();
	   return next();
	 });
};

var mongoDao = require('../dao/dao.js');
var log = require('../logger/logger.js');