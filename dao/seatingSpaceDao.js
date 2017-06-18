'use strict';

module.exports = {
	// gets seating space data
	getSeatingSpaceData: callBack => {
		mongoDo((db, next) => {
			var seatingSpace = {
				tableCount : 0,
				chairCount : 0,
				spaceCapacity: 0
			};
			db.collection(SEATING_SPACE).findOne({}, (err,data) => {
					assert(err);
					next();
					if(data) {
						seatingSpace.tableCount = data.tableCount;
						seatingSpace.chairCount = data.chairCount;
						seatingSpace.spaceCapacity = data.spaceCapacity;
					} else {
						log.info("no record found!");
					}
					callBack(seatingSpace);
		    	});
		});
	}

};

var log = require('../logger/logger.js');
var dao = require('./dao.js');
const SEATING_SPACE = 'seatingSpace';

var mongoDo = dao.mongoDo.bind(dao);
var assert = dao.assert.bind(dao);