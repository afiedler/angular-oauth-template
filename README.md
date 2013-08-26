# [AngularJS](http://www.angularjs.org/) OAuth Skeleton App

***

## Purpose

The idea is to **demonstrate how to write a single-page app that authenticates with OAuth using AngularJS**.

## Stack

* AngularJS on the front-end.
* [grunt-ngdocs](https://github.com/m7r/grunt-ngdocs) to generate front-end documentation
* Simple node.js static file server to serve documentation and the front-end app
* **Not included:** an OAuth backend.

### Platform & tools

You need to install Node.js and then the development tools. Node.js comes with a package manager called [npm](http://npmjs.org) for installing NodeJS applications and libraries.
* [Install node.js](http://nodejs.org/download/) (requires node.js version >= 0.8.4)
* Install Grunt-CLI and Karma as global npm modules:

    ```
    npm install -g grunt-cli karma
    ```

(Note that you may need to uninstall grunt 0.3 globally before installing grunt-cli)

### App Server

The backend application server is a NodeJS application that relies upon some 3rd Party npm packages.  You need to install these:

* Install local dependencies:

    ```
    cd server
    npm install
    cd ..
    ```

### Client App

This client application is a straight HTML/Javascript application but the development process uses a Node.js build tool
[Grunt.js](gruntjs.com). Grunt relies upon some 3rd party libraries that we need to install as local dependencies using npm.

* Install local dependencies:

    ```
    cd client
    npm install
    cd ..
    ```

### Build the client app
The app made up of a number of javascript, css and html files that need to be merged into a final distribution for running.  We use the Grunt build tool to do this.
* Build client application: 
    
    ```
    cd client
    grunt build
    ```

## Running
### Start the Server
* Run the server

    ```
    cd server
    node server.js
    ```
* Browse to the application at [http://localhost:4000]

## Development

### Folders structure
At the top level, the repository is split into a client folder and a server folder.  The client folder contains all the client-side AngularJS application.  The server folder contains a very basic Express based webserver that delivers and supports the application.
Within the client folder you have the following structure:
* `build` contains build tasks for Grunt
* `dist` contains build results
* `src` contains application's sources
* `test` contains test sources, configuration and dependencies *(no tests yet!)*
* `vendor` contains external dependencies for the application

### Default Build

*Note: there are currently no tests, but the app is set up to support testing with Jasmine and Karma*

The default grunt task will build (checks the javascript (lint), runs the unit tests (test:unit) and builds distributable files) and run all unit tests: `grunt` (or `grunt.cmd` on Windows).  The tests are run by karma and need one or more browsers open to actually run the tests.
* `cd client`
* `grunt`
* Open one or more browsers and point them to [http://localhost:8080/__test/].  Once the browsers connect the tests will run and the build will complete.
* If you leave the browsers open at this url then future runs of `grunt` will automatically run the tests against these browsers.

### Continuous Building
The watch grunt task will monitor the source files and run the default build task every time a file changes: `grunt watch`.

### Build without tests
If for some reason you don't want to run the test but just generate the files - not a good idea(!!) - you can simply run the build task: `grunt build`.

### Building release code
You can build a release version of the app, with minified files. 
* `cd client`
* Run `grunt release`
* Open one or more browsers and point them to [http://localhost:8080/__test/].  Once the browsers connect the tests will run and the build will complete.
* If you leave the browsers open at this url then future runs of `grunt` will automatically run the tests against these browsers.

### Continuous testing
You can have grunt (karma) continuously watch for file changes and automatically run all the tests on every change, without rebuilding the distribution files.  This can make the test run faster when you are doing test driven development and don't need to actually run the application itself.

* `cd client`
* Run `grunt test-watch`.
* Open one or more browsers and point them to [http://localhost:8080/__test/].
* Each time a file changes the tests will be run against each browser.
