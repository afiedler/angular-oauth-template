
angular.module('login', [])

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl:'login/login.tpl.html',
    controller:'LoginCtrl'
  });
}])

/**
 * @ngdoc object
 * @name login.controller:LoginCtrl
 *
 * @description
 * Handles the login screen
 *
 */
.controller('LoginCtrl', 
  ['$scope', '$location', '$route', '$http', 'auth', 
  function ($scope, $location, $route, $http, auth) {

    $scope.authenticate = function() {
      auth.authenticateUserAsync().then(
        function(ret){
          $location.path(ret.redirectAfterLogin);
        }, function(){
          // error!
        });
    };

}]);