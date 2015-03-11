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

createApp.controller('createController', ['$scope', function($scope){

var geocoder;
var initialize = function () {
    var geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(40.014986, -105.270546);
    var mapOptions = {
      zoom: 12,
      center: latlng
    };
      var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
};

/* Center map on zip code input from form on search submit */
var codeAddress = function() {
  var address = document.getElementById('address').value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      mapCenterLocation = results[0].geometry.location;
    }   else {
        alert('Please enter a zip code');
        }
  });
};
}]);

// Controls Datepicker settings
createApp.controller('DatepickerCtrl', ['$scope', function ($scope) {
  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
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
    formatYear: 'yy',
    startingDay: 0,
    showWeeks: false,
  };

  $scope.format = 'shortDate';
}]);

// Configures Timepicker settings
createApp.controller('TimepickerCtrl', ['$scope', '$log', function ($scope, $log) {
  $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 1;

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
    $log.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };
}]);

// Create search bar directive
createApp.directive('searchBar', function(){
  return {
    retrict: 'E',
    templateUrl: '/templates/search'
  };
});

// New Activity Controller
// createApp.controller('newActivityController', ['$scope', function($scope){
//   $scope.item = {};
//   $scope.addActivity = function(){

//   };
// }]);