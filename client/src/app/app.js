angular.module('app', [
  'ngRoute',
  'oauthCallback',
  'templates.app',
  'templates.common',
  'authentication',
  'configuration',
  'login',
  'example'])

.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  // Redirect when other route not found
  $routeProvider.otherwise({redirectTo:'/example'}); 
}])

/**
 * @ngdoc object
 * @name app.controller:AppCtrl
 *
 * @description
 * Main App Controller.
 *
 */
.controller('AppCtrl', ['$scope', function($scope) {


}])

/**
 * @ngdoc object
 * @name app.controller:HeaderCtrl
 *
 * @description
 * Header controller
 *
 */
.controller('HeaderCtrl', 
  ['$scope', '$location', '$route', '$http', 'auth', 
  function ($scope, $location, $route, $http, auth) {

    $scope.isAuthenticated = auth.isAuthenticated();
    if($scope.isAuthenticated) {
      $scope.authenticatedUserInfo = auth.authenticatedUserInfo();
    }

    $scope.logOut = function () {
      auth.logOut();
    };

    $scope.$on('userAuthenticated', function(event, userInfo) {
      $scope.isAuthenticated = true;
      $scope.authenticatedUserInfo = userInfo;
    });

    $scope.$on('userDeauthenticated', function(event) {
      $scope.isAuthenticated = false;
      $scope.authenticatedUserInfo = null;
    });


}])

