// ANGULE CLIENT SIDE
var createApp = angular.module('createApp',
  ['ngResource', 'ngRoute']
);

// Configure client-side routing
createApp.config(function($routeProvider){
  $routeProvider
    .when('/create', {
      templateUrl: 'create',
      controller: 'createController'
    })
    .when('/view/:id', {
      templateUrl: '/templates/view',
      controller: 'viewController'
    });
});

// Data from server:
createApp.factory('Activity',['$resource', function($resource){
  // Define and return a resource connection
  var model = $resource(
    '/api/view/:id',
    {id: '@_id'}
  );

  return {
    model: model,
    items: model.query()
  };
}]);

createApp.controller('viewController', ['$routeParams','$scope','Activity', function($routeParams, $scope, Activity){
  $scope.item = Activity.model.get({_id: $routeParams.id});
}]);

createApp.controller('listController',['$scope', 'Activity', function($scope, Activity){
  $scope.activites = Activity.items;
}]);

// New Activity Controller
// createApp.controller('newActivityController', ['$scope', function($scope){
//   $scope.item = {};
//   $scope.addActivity = function(){

//   };
// }]);