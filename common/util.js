'use strict';

module.exports = {
	getEventTime: (eventTime) => (eventTime) ? new Date(eventTime) : new Date()
};