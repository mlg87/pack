// ANGULE CLIENT SIDE
var createApp = angular.module('createApp',
  ['ngResource', 'ngRoute', 'ui.bootstrap', 'uiGmapgoogle-maps']
);

// Configure client-side routing
createApp.config(function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl: '/templates/landing',
      controller: 'searchController'
    })
    .when('/view/:id', {
      templateUrl: '/templates/view',
      controller: 'viewController'
    })
    .when('/create', {
      templateUrl: '/templates/create',
      controller: 'createController'
    })
    .when('/search', {
      templateUrl: 'templates/search',
      controller: 'searchController'
    })
    .when('/results', {
      templateUrl: 'templates/results',
      controller: 'resultsController'
    });
});

// Config Google Maps SDK Async Loader
createApp.config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyDqFwM-p6X0FZLv1SETkOWi7TL_M6J0z9k',
      v: '3.17',
      libraries: 'weather,geometry,visualization'
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

// Sets item scope for speicifc Activity ID.
createApp.controller('viewController', ['$routeParams','$scope','Activity', function($routeParams, $scope, Activity){
  $scope.item = Activity.model.get({_id: $routeParams.id});
}]);

// createApp.controller('listController',['$scope', 'Activity', function($scope, Activity){
//   $scope.activites = Activity.items;
// }]);

createApp.controller('searchController', ['$scope', function($scope){
}]);

createApp.controller('resultsController', ['$scope', function($scope){

}]);


// Create Activity controller
createApp.controller('createController', ['$scope','uiGmapGoogleMapApi','$filter','$log','$timeout', function($scope, uiGmapGoogleMapApi, $filter, $log, $timeout){
  $scope.data = {};

  // Prepare form submission for new DB object
  $scope.publishActivity = function(activityDetails){
    var activity = angular.copy(activityDetails);
    // console.log(activity);
    // Filter date to short date
    var date = $filter('date')(activity.date, 'shortDate');
    // console.log('filtered date: ', date);
    // Filter time to 24hr time
    var time = $filter('date')(activity.time, 'HH:mm');
    // console.log('filtered time: ', time);

    // Setup new Activity object to be saved to DB
    var publish = {
      creator: 'Creator name',
      activityName: activity.name,
      activityDate: date,
      activityTime: time,
      activityDistance: activity.distance,
      activityPace: activity.pace,
      activityAddress: {
        lat: 'LatNumber',
        lng: 'LngNumber',
      },
      activityDescption: activity.description,
    };
    console.log('publish: ', publish);
  };


  // Do stuff with your $scope.
  // Note: Some of the directives require at least something to be defined originally!
  // e.g. $scope.markers = []
  $scope.map = { center: { latitude: 40.014986, longitude: -105.270546 }, zoom: 12 };
  $scope.options = {scrollwheel: false};
  $scope.coordsUpdates = 0;
  $scope.dynamicMoveCtr = 0;
  $scope.marker = {
    id: 0,
    coords: {
      latitude: 40,
      longitude: -99
    },
    options: { draggable: true },
    events: {
      dragend: function (marker, eventName, args) {
        $log.log('marker dragend');
        var lat = marker.getPosition().lat();
        var lon = marker.getPosition().lng();
        $log.log(lat);
        $log.log(lon);

        $scope.marker.options = {
          draggable: true,
          labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
          labelAnchor: "100 0",
          labelClass: "marker-labels"
        };
      }
    }
  };

  $scope.$watchCollection("marker.coords", function (newVal, oldVal) {
    if (_.isEqual(newVal, oldVal))
      return;
    $scope.coordsUpdates++;
  });
  $timeout(function () {
    $scope.marker.coords = {
      latitude: 40.014986,
      longitude: -105.270546
    };
    $scope.dynamicMoveCtr++;
    $timeout(function () {
      $scope.marker.coords = {
        latitude: 40.014986,
      longitude: -105.240546
      };
      $scope.dynamicMoveCtr++;
    }, 2000);
  }, 1000);

  // uiGmapGoogleMapApi is a promise.
  // The "then" callback function provides the google.maps object.
  uiGmapGoogleMapApi.then(function(maps){


  });
}]);

// Controls Datepicker settings
createApp.controller('DatepickerCtrl', ['$scope', function ($scope) {
  $scope.today = function() {
    $scope.date = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.date = null;
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    startingDay: 0,
    showWeeks: false,
  };

  $scope.format = 'shortDate';
}]);

// Configures Timepicker settings
createApp.controller('TimepickerCtrl', ['$scope', '$log', function ($scope, $log) {
  $scope.time = new Date();

  $scope.hstep = 1;
  $scope.mstep = 1;

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.changed = function () {
    $log.log('Time changed to: ' + $scope.time);
  };
}]);

// Create search bar directive
createApp.directive('searchBar', function(){
  return {
    restrict: 'E',
    templateUrl: '/templates/search'
  };
});

// Time picker directive
createApp.directive('pickTime', function(){
  return {
    restrict: 'E',
    templateUrl: '/templates/time'
  };
});

// New Activity Controller
// createApp.controller('newActivityController', ['$scope', function($scope){
//   $scope.item = {};
//   $scope.addActivity = function(){

//   };
// }]);