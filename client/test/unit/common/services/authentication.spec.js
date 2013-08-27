/*jshint -W087 */ 
describe('Authentication Service', function () {

  /*var http, window, rootScope, q, CONFIG, location, timeout;
  beforeEach(module('auth'));
  beforeEach(function(){
    inject(function($injector) {
      http = $injector.get('$http');
      window = $injector.get('$window');
      rootScope = $injector.get('$rootScope');
      q = $injector.get('$q');
      CONFIG = {
        oauth_api_client_id: 'CLIENT_ID',
        oauth_api_endpoint: 'http://myendpoint.com/api/v1',
        oauth_callback_url: 'http://myapp.com/oauth_callback'
      };
      location = $injector.get('$location');
      timeout = $injector.get('$timeout');
    });
  }); 

  var $httpBackend, $rootScope, createController;
 
   beforeEach(inject(function($injector) {
     // Set up the mock http service responses
     $httpBackend = $injector.get('$httpBackend');
     // backend definition common for all tests
     $httpBackend.when('GET', '/auth.py').respond({userId: 'userX'}, {'A-Token': 'xxx'});
 
     // Get hold of a scope (i.e. the root scope)
     $rootScope = $injector.get('$rootScope');
     // The $controller service is used to create instances of controllers
     var $controller = $injector.get('$controller');
 
     createController = function() {
       return $controller('MyController', {'$scope' : $rootScope });
     };
   })); */

  var mockWindow =
  {
    open: function(url,name,formatOptions) {
      mockWindow._openedUrl = url;
      return 'dummy popup';
    },
    /*addEventListener: function(type,listener) {
      if(type === 'message') {
        mockWindow._messageListener = listener;
      } 
    },*/
    location: {origin: 'dummy origin'},
    _openedUrl: null,
    _messageListener: null
  };
  
 
  beforeEach(function () {
    module('authentication');
    module('configuration');
  });

  afterEach(inject(function($injector) {
     var $httpBackend = $injector.get('$httpBackend');
     $httpBackend.verifyNoOutstandingExpectation();
     $httpBackend.verifyNoOutstandingRequest();
  }));

  //inject(function($injector) {
    // Set up the mock http service responses
    //$httpBackend = $injector.get('$httpBackend');
    // backend definition common for all tests
    //$httpBackend.when('GET', '/auth.py').respond({userId: 'userX'}, {'A-Token': 'xxx'});

    // Get hold of a scope (i.e. the root scope)
    //$rootScope = $injector.get('$rootScope');
    // The $controller service is used to create instances of controllers
    

    
  //}));

  it('should not be authenticated on creation', inject(function($injector) {
    var auth = $injector.get('auth');
    expect(auth.isAuthenticated()).toEqual(false);
  }));

  it('should return null for authenticatedUserInfo when no user authenticated', inject(function($injector) {
    var auth = $injector.get('auth');
    expect(auth.authenticatedUserInfo()).toEqual(null);
  }));

  it('should return false when logOut() is called but no user is authenticated', inject(function($injector) {
    var auth = $injector.get('auth');
    expect(auth.logOut()).toEqual(false);
  }));

  it('should be authenticated when the access_token is created', function() {    
    // Override the authState to fake being logged in
    module(function($provide) {
      $provide.value('authState', {access_token: '12345'}); // override access_token
    });
 
    inject(function($injector) {
      var auth = $injector.get('auth');
      expect(auth.isAuthenticated()).toEqual(true);
    });

  });

  it('should return the userinfo from authState when authenticated', function() {
    // Override the authState to fake being logged in
    module(function($provide) {
      $provide.value('authState', {access_token: '12345', userinfo: 'user info object'}); // override access_token
    });
 
    inject(function($injector) {
      var auth = $injector.get('auth');
      expect(auth.isAuthenticated()).toEqual(true);
      expect(auth.authenticatedUserInfo()).toEqual('user info object');
    });
    
  });


  it('method redirectIfNotLoggedIn should redirect to /login when no user is authenticated', inject(function($injector) {
    var auth = $injector.get('auth');
    var $location = $injector.get('$location');
    var ret = auth.redirectIfNotLoggedIn();
    expect(ret).toEqual(true); // expect a redirection

    expect($location.path()).toEqual('/login');
  }));


  it('should open a popup on authenticateUserAsync()', function() {

    module(function ($provide) {
      $provide.value('$window', mockWindow);
    });

    inject(function($injector) {
      var auth = $injector.get('auth');
      var CONFIG = $injector.get('CONFIG');
      auth.authenticateUserAsync();
      expect(mockWindow._openedUrl).toEqual(CONFIG.oauth_api_endpoint + '/oauth/authorize?response_type=token&client_id=' +
          CONFIG.oauth_api_client_id + '&redirect_uri=' + encodeURIComponent(CONFIG.oauth_callback_url));
    });
  });

  it('should GET token info when popup calls postMessage', function() {

    module(function ($provide) {
      $provide.value('$window', mockWindow);
    });

    inject(function($injector) {
      var auth = $injector.get('auth');
      var CONFIG = $injector.get('CONFIG');
      // Set up the mock http service responses
      var $httpBackend = $injector.get('$httpBackend');
      $httpBackend.expect('GET',CONFIG.oauth_api_endpoint + '/oauth/token/info')
        .respond({application: { uid: CONFIG.oauth_api_client_id}} );
     

      var authenticated = null;
      
      auth.authenticateUserAsync().then(function() {
        authenticated = true;
      },
      function (error) {
        authenticated = error;
      });

      expect(mockWindow._openedUrl).toEqual(CONFIG.oauth_api_endpoint + '/oauth/authorize?response_type=token&client_id=' +
          CONFIG.oauth_api_client_id + '&redirect_uri=' + encodeURIComponent(CONFIG.oauth_callback_url));

      // Now, pretend the window returns the access_token
      angular.element(mockWindow).trigger('message', {access_token: '123456789'});
      expect(authenticated).toEqual(true);
      $httpBackend.flush();
      
    });
  });


});

