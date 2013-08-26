exports.addRoutes = function(app, config) {
  // This route deals enables HTML5Mode by forwarding missing files to the index.html
  app.all('/*', function(req, res) {
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');

    // Just send the index.html for other files to support HTML5Mode
    res.sendfile('index.html', { root: config.server.distFolder });

  });
};