'use strict';

var bunyan  = require('bunyan');
var PrettyStream = require('bunyan-prettystream');
var prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

module.exports = bunyan.createLogger({
  name        : 'watchout',
  level       : process.env.LOG_LEVEL || 'info',
  stream      : prettyStdOut,
  serializers : bunyan.stdSerializers
});