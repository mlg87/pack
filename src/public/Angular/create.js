////////////////////////
// ANGULE CLIENT SIDE //
////////////////////////
var map = null;
var markers = [];
var pinLocation = [];
var createApp = angular.module('createApp',
  ['ngResource', 'ngRoute', 'ui.bootstrap', 'ngMaterial',
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

// Filters out only mintues
createApp.filter('minutes', [function(){
  return function(seconds){
    return Math.floor(seconds/60);
  };
}]);

// Filters out only seconds
createApp.filter('seconds', [function(){
  return function(seconds){
    var min = Math.floor(seconds/60);
    return seconds - min * 60;
  };
}]);

/**
 * Convert time object to 24 hour format
 * @param  {Obejct} { return function(input) {
 * Add's 12 to hour if PM and between 1 and 11 hour.
 * Prepends 0 to hour if 12AM
 * Otherwise add hour and minutes together
 */
createApp.filter('timeTo24', [function(){
  return function(input){
      var hr = parseInt(input.hour);
      var min = input.minute;
      var ap = input.ampm;

      if ((ap === 'PM') && (hr < 12)) {
        var tfHR = parseInt(hr) + 12;
        return tfHR + ':' + min;
      }
        else if ((ap ==='AM') && (hr === 12)){
          return '0' + ':' + min;
        }
          else {
           hours = parseInt(hr);
           return hours + ':' + min;
          }
  };
}]);

// Sets a fixed length by prepending 0 if length is not met.
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


/////////////////////////
// Search for Activity //
/////////////////////////
createApp.controller('searchController', ['$scope','$log','$filter', function($scope, $log, $filter){
  $scope.search = {};
  $scope.hideZip = false;
  // Filter date to short date

    // Build object of search criteria
    $scope.searchRuns = function (input){
      var date = $filter('date')(input.date, 'yyyy-MM-dd');
      var time = $filter('timeTo24')(input.time);

      var search = {
        searchDate : date,
        searchTime : time,
        searchDist : input.distance,
        searchPace : input.pace,
        searchZip  : input.address
      };
    };
}]);

// Store available option for selecting time
createApp.controller('timeSelectCtrl', ['$scope','$log', function($scope, $log){
  $scope.hours = ['1','2','3','4','5','6','7','8','9','10','11','12'];
  $scope.minutes = ['00','05','10','15','20','25','30','35','40','45','50','55'];
  $scope.amPM = ['AM','PM'];
}]);

// Show Results
createApp.controller('resultsController', ['$scope','$filter','$log','$timeout','Activity', function($scope, $filter, $log, $timeout, Activity){
  $scope.results = Activity.items;

}]);

// Create Activity controller
createApp.controller('createController', ['$scope','$filter','$log','$timeout','Activity', function($scope, $filter, $log, $timeout, Activity){
  $scope.search = {};
  // Hide zip when creating activity
  $scope.hideZip = true;

  // Prepare form submission for new DB object
  $scope.publishActivity = function(activityDetails){
    var activity = angular.copy(activityDetails);
    // console.log('Activity: ', activity);

    // Filter date to short date
    var date = $filter('date')(activity.date, 'yyyy-MM-dd');

    // Filter time to 24hr format
    var time = $filter('timeTo24')(activity.time);

    // Build timestamp for event
    var buildTimeStamp = date + 'T' + time;

    // Get last marker coordinates
    var lastCoords = locationSearch();

    // Setup new Activity object to be saved to DB
    var publish = {
      creator: 'Creator name',
      activityName: activity.name,
      activityDate: date,
      activityTime: time,
      activityDistance: activity.distance,
      activityPace: activity.pace,
      activityAddress: {
        lat: lastCoords.latitude,
        lng: lastCoords.longitude,
      },
      activityDescption: activity.description,
      activityTimeStamp: buildTimeStamp,
    };
    var newActivitiy = new Activity.model(publish);
    newActivitiy.$save(function(savedItem){
      $log.log(savedItem);
    });
  };

  ////////////////
  // GOOGLE MAP //
  ////////////////
  function initialize() {
      var mapOptions = {
          center: { lat: 40.014986, lng: -105.270546},
          zoom: 12,
          mayTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }
  initialize();

  function codeAddress() {
    var address = document.getElementById('address').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  // Click listener on map to clear markers and add a new one.
  google.maps.event.addListener(map, 'click', function(e){
    if(markers){
      clearMarkers();
    }
    placeMarker(e.latLng, map);
  });

  // Returns last placed pin location.
  var locationSearch = function (){
    var coord = _.last(pinLocation);
    var coords = {
      latitude: coord.k,
      longitude: coord.D
    };
    return coords;
  };

  // Places the marker from the click listener call.
  var placeMarker = function(position, map){
    var marker = new google.maps.Marker({
      position: position,
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP
    });
    markers.push(marker);
    map.panTo(position);
    pinLocation.push(marker.getPosition());
  };

  // Goes through all the markers on the page and sets to map.
  var setAllMap = function (map){
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  };

  // Clear all markers on page before adding new one.
  var clearMarkers = function() {
    setAllMap(null);
  };

  // Create new marker on locate button click.
  $scope.locator = function(){
      var showPosition = function(pos){
          var myLatLng = new google.maps.LatLng( pos.coords.latitude, pos.coords.longitude );
          var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            draggable: true,
          });
          // Push marker to array of all markers to get last marker.
          markers.push(marker);
          // Push markers location to array of location
          pinLocation.push(marker.getPosition());
          map.panTo(myLatLng);
      };

      // Check if geolocation is available.
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
          clearMarkers();
      }
  };

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

// Create results directive
createApp.directive('activity', function(){
  return {
    restrict: 'E',
    templateUrl: '/templates/view'
  };
});

// createApp.directive('googleMaps', function(){
//   return {
//     restrict: 'E',
//     templateUrl: '/templates/googlemap'
//   };
// });
