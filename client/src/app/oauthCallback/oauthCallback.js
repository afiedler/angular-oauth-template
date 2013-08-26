
angular.module('oauthCallback', [])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/oauth_callback', {
    templateUrl:'oauthCallback/oauthCallback.tpl.html',
    controller:'OauthCallbackCtrl'
  });
}])

/**
 * @ngdoc object
 * @name oauthCallback.controller:OauthCallbackCtrl
 *
 * @description
 * Handles OAuth callbacks from the OAuth server. The OAuth <code>redirect_uri</code> should
 * redirect to a path managed by this controller.
 *
 * This controller takes the part of the URL route after '#', parses the query params, and then
 * calls <code>window.opener.postMessage()</code> to alert the opener window that the OAuth
 * server has redirected the user to the callback. The opener window should be listening for
 * message events from this controller's window. 
 */
.controller('OauthCallbackCtrl', ['$scope', '$location',
  function ($scope, $location) {
    
    /*
     * Parses an escaped url query string into key-value pairs and returns them as an object
     *
     * (Copied from Angular.js in the AngularJS project.)
     *
     */
    function parseKeyValue(keyValue) {
      var obj = {}, key_value, key;
      angular.forEach((keyValue || "").split('&'), function(keyValue){
        if (keyValue) {
          key_value = keyValue.split('=');
          key = decodeURIComponent(key_value[0]);
          obj[key] = angular.isDefined(key_value[1]) ? decodeURIComponent(key_value[1]) : true;
        }
      });
      return obj;
    }

    var queryString = $location.url().split('#')[1];  // strip out params part of URL
    var params = parseKeyValue(queryString);

    // TODO: The target origin should be set to an explicit origin.  Otherwise, a malicious site can receive
    //       the token if it manages to change the location of the parent. (See:
    //       https://developer.mozilla.org/en/docs/DOM/window.postMessage#Security_concerns)

    window.opener.postMessage(params, "*");
    window.close();

}]);