////////////////////////
// ANGULE CLIENT SIDE //
////////////////////////
var map = null;
var geocoder;
var markers = [];
var pinLocation = [];
var createApp = angular.module('createApp',
  ['ngResource', 'ngRoute', 'ui.bootstrap', 'ngMaterial'
  ]
);


// Configure client-side routing
createApp.config(function($routeProvider,$httpProvider,$locationProvider){

  // Check if the user is connected
  //================================================
  var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user){
        // Authenticated
        if (user !== '0')
          /*$timeout(deferred.resolve, 0);*/
          deferred.resolve();

        // Not Authenticated
        else {
          $rootScope.message = 'You need to log in.';
          //$timeout(function(){deferred.reject();}, 0);
          deferred.reject();
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

  // Add an interceptor for AJAX errors
  //================================================
  $httpProvider.interceptors.push(function($q, $location) {
    return {
      response: function(response) {
        // do something on success
        return response;
      },
      responseError: function(response) {
        if (response.status === 401)
          $location.url('/login');
        return $q.reject(response);
      }
    };
  });

  // Define all routes
  // =================================================
  $routeProvider
    .when('/', {
      templateUrl: '/templates/landing',
      controller: 'searchController'
    })
    .when('/view/:id', {
      templateUrl: '/templates/viewActivity',
      controller: 'viewController',
      resolve: {
          // loggedin: checkLoggedin
        }
    })
    .when('/create', {
      templateUrl: '/templates/create',
      controller: 'createController',
      resolve: {
          // loggedin: checkLoggedin
        }
    })
    .when('/search', {
      templateUrl: 'templates/search',
      controller: 'searchController'
    })
    .when('/results', {
      templateUrl: 'templates/results',
      controller: 'resultsController'
    })
    .when('/admin', {
      templateUrl: 'templates/admin',
      controller: 'adminController',
      resolve: {
          // loggedin: checkLoggedin
        }
    })
    .when('/login', {
      templateUrl: 'templates/login',
      controller: 'loginController'
    })
    .otherwise({
      redirectTo:'/'
    });
  }) // end of config()
  .run(function($rootScope, $http){
    $rootScope.message = '';

    // Logout function is available in any pages
    $rootScope.logout = function(){
      $rootScope.message = 'Logged out.';
      $http.post('/logout');
    };
  });


  /****************************
   * Login controller
   ****************************/
  createApp.controller('loginController', function($scope, $rootScope, $http, $location, $log) {
    // This object will be filled by the form
    $scope.user = {};

    // Register the login() function
    $scope.login = function(){
      $log.log($scope.user);
      $http.post('/login', {
        username: $scope.user.username,
        password: $scope.user.password,
      })
      .success(function(user){
        // No error: authentication OK
        $rootScope.message = 'Authentication successful!';
        $location.url('/admin');
      })
      .error(function(){
        // Error: authentication failed
        $rootScope.message = 'Authentication failed.';
        $location.url('/login');
      });
    };
  });



  /***************************
   * Admin controller
   ***************************/
  createApp.controller('adminController', function($scope, $http) {
    // List of users got from the server
    $scope.users = [];

    // Fill the array to display it in the page
    $http.get('/users').success(function(users){
      for (var i in users)
        $scope.users.push(users[i]);
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

// Data from the user:
createApp.factory('User',['$resource', function($resource){
  // Define and return a resource connection
  var user = $resource(
    '/api/user/:id',
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
      console.log('in filter: ',input);
      var hr = input.hour;
      var min = input.minute;
      var ap = input.ampm;

      if ((ap === 'PM') && (hr < 12)) {
        var tfHR = hr + 12;
        return tfHR + ':' + min;
      }
        else if ((ap ==='AM') && (hr === 12)){
          return '0' + ':' + min;
        }
          else {
           hours = hr;
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

// Controller for singal activity page.
createApp.controller('singleActivityController', ['$routeParams','$scope','Activity','$log','$http', function($routeParams, $scope, Activity, $log,$http){

  // Data object from DB
  var data;

  // Get activity data from DB
  $scope.item = Activity.model.get({_id: $routeParams.id});

  // Set the DB data to 'data'
  Activity.model.get({_id: $routeParams.id})
  .$promise.then(function(act){
    data = act;
    console.log('data',data);
    // Initalize map once we have data.
    initialize();

    // place marker once we have data
    placeMarker(data.activityAddress, map);
  });

  ////////////////////////////////
  // SINGLE ACTIVITY GOOGLE MAP //
  ////////////////////////////////

  // map initialization options
  function initialize() {
      var mapOptions = {
          center: new google.maps.LatLng(data.activityAddress[0], data.activityAddress),
          zoom: 15,
          mayTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }
  // marker initialization options
  var placeMarker = function(position, map){
    var marker = new google.maps.Marker({
      position: (position[0],position[1]),
      map: map,
      draggable: false,
      animation: google.maps.Animation.DROP
    });
  };

  // Comment stream
  var commentItem = {
    face: '/images/logo-button.png',
    who: 'Lorem',
    date: '9/6/14',
    comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce interdum elit in nibh tristique aliquam.'
  };

  $scope.comments = [];
  for (var i = 0; i < 6; i++){
    $scope.comments.push({
      face: '/images/logo-button.png',
      who: 'Lorem',
      date: '9/6/14',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce interdum elit in nibh tristique aliquam.'
    });
  }
}]);



createApp.controller('navBarController', ['scope', function($scope){

   $scope.status = {
    isopen: false
  };
}]);
/////////////////////////
// Search for Activity //
/////////////////////////
createApp.controller('searchController', ['$scope','$log','$filter','Activity','$http', function($scope, $log, $filter, Activity, $http){
  $scope.search = {};
  // Shows zip on search. Changed on creating an event.
  $scope.hideZip = false;

  var search;
  var geoLatLng;

  $scope.results = Activity.items;
  // Filter date to short date

    geocoder = new google.maps.Geocoder();

    $scope.codeAddress = function(input) {
      geocoder.geocode( { 'address': input.address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          geoLatLng = results[0].geometry.location;
          buildSearch(geoLatLng, input);
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    };
    // Build search object from form
     var buildSearch = function(geoLatLng, input){
        var date = $filter('date')(input.date, 'yyyy-MM-dd');
        var time = $filter('timeTo24')(input.time);
        var arrayCoords = [geoLatLng.D, geoLatLng.k];
        console.log('geo',arrayCoords);
        search = {
          activityDate : date,
          activityTime : time,
          activityDistance : input.distance,
          activityPace : input.pace,
          activityAddress  : arrayCoords
        };
        $http.post('/api/search', search).success(function(data){
          $log.log('success: ', data);
        }).error(function(data){
          $log.warn('error: ', data);
        });
        $log.log(search);
      };

  // $scope.apply(function(){

  // });

}]);

// Store available option for selecting time
createApp.controller('timeSelectCtrl', ['$scope','$log', function($scope, $log){
  $scope.hours = ['1','2','3','4','5','6','7','8','9','10','11','12'];
  $scope.minutes = ['00','05','10','15','20','25','30','35','40','45','50','55'];
  $scope.amPM = ['AM','PM'];
}]);

// Show Results
createApp.controller('resultsController', ['$scope','$filter','$log','$timeout','Activity', function($scope, $filter, $log, $timeout, Activity){
  // $scope.results = Activity.items;

}]);

createApp.controller('listViewController', ['$scope', function($scope){

}]);

// Create Activity controller
createApp.controller('createController', ['$scope','$filter','$log','$timeout','Activity', function($scope, $filter, $log, $timeout, Activity){
  // $scope.search = {};
  // Hide zip when creating activity
  $scope.hideZip = true;
  $scope.search = {};
  // Prepare form submission for new DB object
  $scope.publishActivity = function(activityDetails){
    var activity = angular.copy(activityDetails);

    // Filter time to 24hr format
    var time = $filter('timeTo24')(activityDetails.time);

    // Filter date to short date
    var date = $filter('date')(activity.date, 'yyyy-MM-dd');
    // Build timestamp for event
    var buildTimeStamp = date + 'T' + time;

    // Get last marker coordinates
    var lastCoords = locationSearch();
    var arrayCoords = [lastCoords.longitude , lastCoords.latitude];
    console.log('coords: ',arrayCoords);

    // Setup new Activity object to be saved to DB
    var publish = {
      creator: 'Michael',
      activityName: activity.name,
      activityDate: date,
      activityTime: time,
      activityDistance: activity.distance,
      activityPace: activity.pace,
      activityAddress: arrayCoords,
      activityDescription: activity.description,
      activityTimeStamp: buildTimeStamp,
    };
    var newActivitiy = new Activity.model(publish);
    newActivitiy.$save(function(savedItem){
      $log.log('created activity: ',savedItem);
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
    templateUrl: '/templates/viewPanel'
  };
});

createApp.directive('googleMaps', function(){
  return {
    restrict: 'E',
    templateUrl: '/templates/googlemap'
  };
});
