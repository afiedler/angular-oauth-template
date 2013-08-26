/*
 * This file starts two simple HTTP servers to be used for development. 
 * One to serve the app and one to serve documentation.
 */

 
// Webapp server

var fs = require('fs');
var http = require('http');

var express = require('express');
var config = require('./config.js');
var app = express();
var server = http.createServer(app);

require('./lib/routes/static').addRoutes(app, config);
require('./lib/routes/appFile').addRoutes(app, config);

app.use(express.logger());                                  // Log requests to the console
app.use(express.bodyParser());                              // Extract the data from the body of the request - this is needed by the LocalStrategy authenticate method
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Start up the server on the port specified in the config
server.listen(config.server.listenPort, 'localhost', 511, function() {
  // // Once the server is listening we automatically open up a browser
  var open = require('open');
  open('http://localhost:' + config.server.listenPort + '/');
});
console.log('Angular App Server - listening on port: ' + config.server.listenPort);

// Docs server server

var fs = require('fs');
var http = require('http');

var express = require('express');
var config = require('./config.js');
var app = express();
var server = http.createServer(app);

require('./lib/routes/docsStatic').addRoutes(app, config);
require('./lib/routes/docsAppFile').addRoutes(app, config);

app.use(express.logger());                                  // Log requests to the console
app.use(express.bodyParser());                              // Extract the data from the body of the request - this is needed by the LocalStrategy authenticate method
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

// Start up the server on the port specified in the config
server.listen(config.server.docsListenPort, 'localhost', 511, function() {
  // // Once the server is listening we automatically open up a browser
  var open = require('open');
  open('http://localhost:' + config.server.docsListenPort + '/');
});
console.log('Angular Docs Server - listening on port: ' + config.server.docsListenPort);
