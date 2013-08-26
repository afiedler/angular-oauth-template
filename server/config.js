path = require('path');

module.exports = {
  server: {
  	// Server listen ports
    listenPort: 4000, 
    docsListenPort: 4001,

  	// Path to the application                                  
    distFolder: path.resolve(__dirname, '../client/dist'),  // The folder that contains the application files (note that the files are in a different repository) - relative to this file
    
    // Path to ng-docs
    docFolder: path.resolve(__dirname, '../client/docs'),
    
    // Route to static assets in the app
    staticUrl: '/static',                               // The base url from which we serve static files (such as js, css and images)
  	
    // Root of docs server
    docUrl: '/'
  }
};