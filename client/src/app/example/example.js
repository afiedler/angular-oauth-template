
angular.module('example', [])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/example', {
    templateUrl:'example/example.tpl.html',
    controller:'ExampleCtrl'
  });
}])

/**
 * @ngdoc object
 * @name example.controller:ExampleCtrl
 *
 * @description
 * An example controller which can only be accessed when logged in. If the user is not logged in,
 * they are redirected away.
 *
 */
.controller('ExampleCtrl', 
  ['$scope', '$location', '$route', '$http', 'auth', 
  function ($scope, $location, $route, $http, auth) {

    // Redirect the user away if they are not logged in
    if(auth.redirectIfNotLoggedIn()) {
      return;  
    }



}]);