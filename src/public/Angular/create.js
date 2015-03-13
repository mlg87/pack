// ANGULE CLIENT SIDE
var createApp = angular.module('createApp',
  ['ngResource', 'ngRoute', 'ui.bootstrap', 'uiGmapgoogle-maps', 'ngMaterial']
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

createApp.controller('timeSelectCtrl', ['$scope', function($scope){
  $scope.hours = ['1','2','3','4','5','6','7','8','9','10','11','12'];
  $scope.minutes = ['10','20','30','40','50'];
  $scope.amPM = ['AM','PM'];



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
  $scope.map = { center: { latitude: 39.97263908708324, longitude: -105.2835922646484 }, zoom: 12 };
  $scope.options = {scrollwheel: false};
      $scope.coordsUpdates = 0;

      $scope.marker = {
        id: 0,
        coords: {
          latitude: 39.97263908708324,
          longitude: -105.2835922646484
        },
        options: { draggable: true },
        events: {
          dragend: function (marker, eventName, args) {
            $log.log('marker dragend');
            var lat = marker.getPosition().lat();
            var lng = marker.getPosition().lng();
            $log.log('marker lat: ', lat);
            $log.log('marker lng: ', lng);

            $scope.marker.options = {
              draggable: true,
            };
          }
        }
      };
    // Take geolocation and assign to variables. Set marker on geoLocation
    function geoCallBack(position){
      var geoLat = position.coords.latitude;
      var geoLng = position.coords.longitude;
      $log.log('geoLat: ', geoLat);
      $log.log('geoLng: ', geoLng);

      $scope.marker.coords = {
          latitude: geoLat,
          longitude: geoLng
      };
      $scope.map.panTo(LatLng(geoLat, geoLng));
      $scope.coordsUpdates++;
    }

  // uiGmapGoogleMapApi is a promise.
  // The "then" callback function provides the google.maps object.
  uiGmapGoogleMapApi.then(function(maps){

    // Check if browser will give geoLocation
    if(Modernizr.geolocation){
      $log.log('yes');
      // Get geoLocation and call geoCallBack with lat/lng.
      navigator.geolocation.getCurrentPosition(geoCallBack);
    }
    else {
      $log.warn('no');
    }

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