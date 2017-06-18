'use strict';

module.exports = (server) => {

	/**
	 * Default GET on cafeteria SeatingSpace, gives seating space information  
	 */
	server.get({
		name: SEATING_SPACE_GETTER,
		path: '/cafeteria/seatingSpace'
	}, seatingSpaceGetter);

};

var mongoDao = require('../dao/seatingSpaceDao.js');
var log = require('../logger/logger.js');
const SEATING_SPACE_GETTER = 'seatingSpaceGetter';

var seatingSpaceGetter = (req, res, next) => {
	mongoDao.getSeatingSpaceData(seatingSpace => {
		res.send(200,seatingSpace);
		next(false);
	});
};
seatingSpaceGetter.handlerName = SEATING_SPACE_GETTER;