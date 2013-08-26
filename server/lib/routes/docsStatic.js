var express = require('express');

exports.addRoutes = function(app, config) {
  // Serve up the favicon
  app.use(express.favicon(config.server.docFolder + '/favicon.ico'));

  // Looks for a static file (docs folder): index.html, css, images, etc.
  app.use(config.server.docFolder, express.compress());
  app.use(config.server.docUrl, express.static(config.server.docFolder));
  app.use(config.server.docUrl, function(req, res, next) {
    res.send(404); // If we get here then the request for a static file is invalid
  });
};