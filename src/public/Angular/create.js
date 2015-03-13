// ANGULE CLIENT SIDE
var createApp = angular.module('createApp',
  ['ngResource', 'ngRoute', 'ui.bootstrap', 'uiGmapgoogle-maps', 'ngMaterial',
  // '720kb.fx'
  ]
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

createApp.filter('minutes', [function(){
  return function(seconds){
    return Math.floor(seconds/60);
  };
}]);

createApp.filter('seconds', [function(){
  return function(seconds){
    var min = Math.floor(seconds/60);
    return seconds - min * 60;
  };
}]);

createApp.filter('numberFixedLen', function () {
        return function (n, len) {
            var num = parseInt(n, 10);
            len = parseInt(len, 10);
            if (isNaN(num) || isNaN(len)) {
                return n;
            }
            num = ''+num;
            while (num.length < len) {
                num = '0'+num;
            }
            return num;
        };
 });

// Sets item scope for speicifc Activity ID.
createApp.controller('viewController', ['$routeParams','$scope','Activity', function($routeParams, $scope, Activity){
  $scope.item = Activity.model.get({_id: $routeParams.id});
}]);

// createApp.controller('listController',['$scope', 'Activity', function($scope, Activity){
//   $scope.activites = Activity.items;
// }]);

// Search for Activity
createApp.controller('searchController', ['$scope','$log','$filter', function($scope, $log, $filter){
  $scope.search = {};
  // Filter date to short date

    $scope.searchRuns = function (input){
      $log.log('search obj: ', input);
      var date = $filter('date')(input.date, 'shortDate');
      console.log('filtered date: ', date);
     ///////////////////////////////
     // Break out into own filter //
     ///////////////////////////////
      var hr = input.time.hour;
      var min = input.time.minute;
      var ap = input.time.ampm;
      var hrToSec = 0;
      var minToSec = 0;
      var totalTimeSec = 0;

      minToSec = (min * 60);

      if ((ap === 'PM') && (hr < 12)) {
        var tfHR = parseInt(hr) + 12;
          // $log.log('+12 :', tfHR);
        hrToSec += (tfHR * 3600);
          // $log.log('+12 secs :', hrToSec);
        minToSec = (min * 60);
        totalTimeSec = hrToSec + minToSec;
      }
        else {
          hrToSec = parseInt(hr) * 3600;
          // $log.log('12 :', tfHr);
          minToSec = (min * 60);
          totalTimeSec = hrToSec + minToSec;
        }
      if (ap === 'AM'){
        var amHour = parseInt(hr) * 3600;
        totalTimeSec = minToSec + amHour;
      }
      $log.log('total: ',totalTimeSec);

    };
}]);

createApp.controller('timeSelectCtrl', ['$scope','$log', function($scope, $log){
  $scope.hours = ['1','2','3','4','5','6','7','8','9','10','11','12'];
  $scope.minutes = ['00','05','10','15','20','25','30','35','40','45','50','55'];
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
    // console.log('publish: ', publish);
  };

  // Do stuff with your $scope.
  // Note: Some of the directives require at least something to be defined originally!
  // e.g. $scope.markers = []
  // $scope.map = { center: { latitude: 39.9723908708324, longitude: -105.283592646484 }, zoom: 12 };
  $scope.options = {scrollwheel: false};
  $scope.circle = false;
  $scope.hide = false;

  $scope.findMe = function(){
    $scope.circle = true;
    $scope.hide = true;
    // Check if browser will give geoLocation
    if(Modernizr.geolocation){
      $log.log('yes');
      // Get geoLocation and call geoCallBack with lat/lng.
      navigator.geolocation.getCurrentPosition(geoCallBack);
    }
    else {
      $log.warn('no');
    }
  };

    // Take geolocation and assign to variables. Set marker on geoLocation
    function geoCallBack(position){
      var geoLat = position.coords.latitude;
      var geoLng = position.coords.longitude;
      $log.log('geoLat: ', geoLat);
      $log.log('geoLng: ', geoLng);
      $scope.circle = false;
      $scope.map.control.refresh({latitude: geoLat, longitude: geoLng});

      // Once user's lat and lng are found drop marker
      if(geoLat && geoLng){
        $log.log('Have latLng');
        $scope.mapsReady = true;
          $scope.marker = {
            id: 0,
            coords: {
              latitude: geoLat,
              longitude: geoLng
            },
            options: { draggable: true },
            events: {
              dragend: function (marker, eventName, args) {
                // $log.log('marker dragend');
                var lat = marker.getPosition().lat();
                var lng = marker.getPosition().lng();
                $log.log('marker lat: ', lat);
                $log.log('marker lng: ', lng);
              }
            }
          };
        }
    }

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