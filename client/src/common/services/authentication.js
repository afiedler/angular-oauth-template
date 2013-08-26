angular.module('authentication', [
  'configuration'
  ])

/**
 * @ngdoc object
 * @name authentication.auth
 *
 * @description
 * Handles OAuth authentication
 *
 */
.factory('auth', ['$http', '$window', '$rootScope', '$q', 'CONFIG', '$location', '$timeout',
    function($http, $window, $rootScope, $q, CONFIG, $location, $timeout){

    // Init code goes here
    var authState = {
      access_token: null 
    };

    var redirectAfterLogin = '/';
    
    var popupHolder = {popup: null};
    var popupDeferred = null;
    var popupOptions = {
        name: 'AuthPopup',
        openParams: {
          width: 650,
          height: 300,
          resizable: true,
          scrollbars: true,
          status: true
      }
      };

    var handlePopupMessage = function(event) {
      event = event.originalEvent; // jQuery mucks things up
      if (event.source === popupHolder.popup && event.origin === window.location.origin) {
        $rootScope.$apply(function() {
          if (event.data.access_token) {
            popupDeferred.resolve(event.data);
          } else {
            popupDeferred.reject(event.data);
          }
        });
      }
    };
    angular.element($window).bind('message', handlePopupMessage);

    var formatPopupOptions = function(options) {
        var pairs = [];
        angular.forEach(options, function(value, key) {
          if (value || value === 0) {
            value = value === true ? 'yes' : value;
            pairs.push(key + '=' + value);
        }
        });
        return pairs.join(',');
    }; 

    var service = {

      /**
       * @ngdoc method
       * @name authentication.auth#logOut
       * @methodOf authentication.auth
       *
       * @description
       * Logs out the current user, if one is logged in. This also redirects the user to '/',
       * unless the user is already at '/'. 
       * 
       * @returns {Boolean} true if the user was logged out, false otherwise
       */
      logOut: function() {
        if(service.isAuthenticated()) {
          authState = { access_token: null };
          $timeout(function() { 
            $rootScope.$broadcast('userDeauthenticated', null);
          });
          if ($location.path() !== '/') {
            $location.path('/');
          }
          return true;
        } else {
          return false;
        }
      },

      /**
       * @ngdoc method
       * @name authentication.auth#isAuthenticated
       * @methodOf authentication.auth
       *
       * @description
       * Checks if the user is authenticated
       * 
       * @returns {Boolean} true if the user is authenticated, false otherwise
       */
      isAuthenticated: function() {
        if(authState.access_token !== null) {
          return true;
        } else {
          return false;
        }
      },

      /**
       * @ngdoc method
       * @name authentication.auth#authenticatedUserInfo
       * @methodOf authentication.auth
       *
       * @description
       * Gets the authenticated user's info
       * 
       * @returns {Object} the users info if the user is authenticated, null otherwise
       */
      authenticatedUserInfo: function() {
        if(service.isAuthenticated()) {
          return authState.userinfo;
        } else {
          return null;
        }
      },

      /**
       * @ngdoc method
       * @name authentication.auth#redirectIfNotLoggedIn
       * @methodOf authentication.auth
       *
       * @description
       * Redirects the used if they are not logged in
       * 
       * @returns {Boolean} true if the user is being redirected, false otherwise
       */
      redirectIfNotLoggedIn: function () {
        if(!service.isAuthenticated() && $location.path() !== '/login') {          
          redirectAfterLogin = $location.path();
          $location.path('/login');
          return true;
        }

        return false;
      },

      /**
       * @ngdoc method
       * @name authentication.auth#authenticateUserAsync
       * @methodOf authentication.auth
       *
       * @description
       * Starts the authentication flow
       *
       * @returns {Promise} Future object
       */
      authenticateUserAsync: function() {
        var deferred = $q.defer();
        popupDeferred = $q.defer();

        popupDeferred.promise.then(
          function(data) {
            // Got the access_token!
            // Now, we make a request to verify
            $http(
              {
                method: 'GET',
                url: CONFIG.oauth_api_endpoint + '/oauth/token/info',
                params: data
              }
            ).success(function(verifyData) {
              // Successfully got token info
              // Confirm the app ID
              var appUid = null;
            
              try {
                appUid = verifyData.application.uid;
              } catch(ex) {}

              if (appUid === CONFIG.oauth_api_client_id) {
                // set the access token
                authState.access_token = data.access_token;
                authState.expires_in = data.expires_in;

                // User is authenticated!
                // Now, get user info
                $http(
                  {
                    method: 'GET',
                    url: CONFIG.oauth_api_endpoint + '/userinfo',
                    params: {access_token: authState.access_token}
                  }
                ).success(function(userinfo){
                  authState.userinfo = userinfo;
                  
                  $timeout(function() { 
                    $rootScope.$broadcast('userAuthenticated', service.authenticatedUserInfo());
                  });
                   
                  deferred.resolve({authState: authState, redirectAfterLogin: redirectAfterLogin});
                  return;
                }).error(function(){
                  deferred.reject("Can't get userinfo");
                });
              } else {
                // Can't verify
                deferred.reject("Can't verify token");
              }
            }
          ).error(function(data, status, headers, config) {
            deferred.reject('HTTP error in verifying token');
          });
          },
          function(data) {
            // No access token!
            deferred.reject('No access token from login popup');
          }
        );

        popupHolder.popup = window.open(
          CONFIG.oauth_api_endpoint + '/oauth/authorize?response_type=token&client_id=' +
          CONFIG.oauth_api_client_id + '&redirect_uri=' + encodeURIComponent(CONFIG.oauth_callback_url),
          popupOptions.name, formatPopupOptions(popupOptions.openParams));

        return deferred.promise;
      }


    };

    return service;
  }]);