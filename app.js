/*jslint node: true, indent: 2 */
'use strict';
var restify, routes, log, server;

restify = require('restify');
routes  = require('./routes/');
log = require('./logger/logger.js');

server = restify.createServer({
  name : 'watchout',
  log  : log,
  formatters : {
    'application/json' : function (req, res, body, cb) {
      res.setHeader('Cache-Control', 'must-revalidate');

      // Does the client *explicitly* accepts application/json?
      var sendPlainText = (req.header('Accept').split(/, */).indexOf('application/json') === -1);

      // Send as plain text
      if (sendPlainText) {
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      }

      // Send as JSON
      if (!sendPlainText) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      }
      return cb(null, JSON.stringify(body));
    }
  }
});

server.use(restify.bodyParser({ mapParams: false }));
server.use(restify.queryParser());
server.use(restify.gzipResponse());
server.pre(restify.pre.sanitizePath());

/*jslint unparam:true*/
// Default error handler. Personalize according to your needs.
server.on('uncaughtException', function (req, res, route, err) {
  // console.log('******* Begin Error *******');
  // console.log(route);
  // console.log('*******');
  console.log(err.stack);
  // console.log('******* End Error *******');
  if (!res.headersSent) {
    return res.send(500, { ok : false });
  }
  // res.write("\n");
  res.end();
});
/*jslint unparam:false*/

server.on('after', restify.auditLogger({ log: log }));
routes(server);

console.log('Server started.');
server.listen(8000, function () {
  log.info('%s listening at %s', server.name, server.url);
});

var websocketBroadcast = require('./websocket/broadcast.js');
websocketBroadcast.openWebsocket(server);