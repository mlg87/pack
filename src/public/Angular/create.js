////////////////////////
// ANGULE CLIENT SIDE //
////////////////////////
var map = null;
var geocoder;
var markers = [];
var pinLocation = [];
var createApp = angular.module('createApp',
  ['ngResource', 'ngRoute', 'ui.bootstrap', 'ngMaterial','ngFx']
);


// Configure client-side routing
createApp.config(function($routeProvider,$httpProvider,$locationProvider){

  // Define all routes
  // =================================================
  $routeProvider
    .when('/', {
      templateUrl: '/templates/landing',
      controller: 'searchController',
      access: { requiredLogin : false }
    })
    .when('/view/:id', {
      templateUrl: '/templates/viewActivity',
      controller: 'viewController',
      access: { requiredLogin : true }
    })
    .when('/create', {
      templateUrl: '/templates/create',
      controller: 'createController',
      access: { requiredLogin : true }
    })
    .when('/search', {
      templateUrl: 'templates/search',
      controller: 'searchController',
      access: { requiredLogin : false }
    })
    .when('/results', {
      templateUrl: 'templates/results',
      controller: 'resultsController',
      access: { requiredLogin : false }
    })
    .when('/admin', {
      templateUrl: 'templates/admin',
      controller: 'adminController',
      access: { requiredLogin : true }
    })
    .when('/login', {
      templateUrl: 'templates/login',
      controller: 'loginController',
      access: { requiredLogin : false }
    })
    .otherwise({
      redirectTo:'/'
    });
  }) // end of config()
  .run(function ($rootScope, $location, $window, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        // Redirect only if both isAuthenticaed is false an no token is set
        if (nextRoute !== null && nextRoute.access !== null && nextRoute.access.requiredLogin && !AuthenticationService.isAuthenticated && !window.sessionStorage.token) {
            $location.path("/login");
        }
    });
  });


// Login Controller
//================================================
createApp.controller('loginController', function ($scope, $http, $window, $location, $log, AuthenticationService) {
  // $scope.user = {username: 'john.doe', password: 'foobar'};
  // $scope.user = {};
   $scope.message = '';
   $scope.login = function () {
     $http
       .post('/authenticate', $scope.user)
       .success(function (data, status, headers, config) {
         AuthenticationService.isAuthenticated = true;
         $window.sessionStorage.token = data.token;
         $location.path('/create');
         // $log.log('data: ' , data );
       })
       .error(function (data, status, headers, config) {
         // Erase the token if the user fails to log in
         delete $window.sessionStorage.token;
         // $log.log('.error from login');

         // Handle login errors here
         $scope.message = 'Error: Invalid user or password';
       });
   };

  $scope.logout = function () {
    if(AuthenticationService.isAuthenticated){
      AuthenticationService.isAuthenticated = false;
      delete $window.sessionStorage.token;
      $location.path('/');
      // $log.log('logged out');
    }
  };

  $scope.signUp = function() {
    // Post route to add new user to DB
      $http.post('/user', $scope.user).success(function(data){
        AuthenticationService.isAuthenticated = true;
        $window.sessionStorage.token = data.token;
        $location.path('/create');
        // $log.log('success post: ', data);
      }).error(function(data){
        // $log.warn('error: ', data);
      });
  };

});


createApp.factory('AuthenticationService', function() {
    var auth = {
        isAuthenticated: false
    };
    return auth;
});

// Add an interceptor for AJAX errors
//================================================
createApp.factory('authInterceptor', function ($log, $rootScope, $q, $window, $location, AuthenticationService) {
  return {
    request: function (config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        config.headers['X-Access-Token'] = $window.sessionStorage.token;
        config.headers['X-Key'] = $window.sessionStorage.user;
        config.headers['Content-Type'] = "application/json";
        // $log.log('I have a token');
      }
      return config || $q.when(config);
    },

    requestError: function(rejection) {
      return $q.reject(rejection);
    },

    /* Set Authentication.isAuthenticated to true if 200 recieved */
    response: function(response){
      if (response !== null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated){
          AuthenticationService.isAuthenticated = true;
          /* Look into watching with scope */
          // $rootScope.isAuth = true;

      }
      return response || $q.when(response);
    },

    /* Revoke client authentication if 401 is received */
    responseError: function (rejection) {
      if (rejection !== null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
        // handle the case where the user is not authenticated
        delete $window.sessionStorage.token;
        AuthenticationService.isAuthenticated = false;
        /* Look into watching with scope */
        // $rootScope.isAuth = false;

        $location.path('/login');
      }
      return $q.reject(rejection);
    }
  };
});

createApp.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});



  // Admin Controller
  //================================================
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
      var hr = parseInt(input.hour);
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
  var loc;

  // Get activity data from DB
  $scope.item = Activity.model.get({_id: $routeParams.id});

  // Set the DB data to 'data'
  Activity.model.get({_id: $routeParams.id})
  .$promise.then(function(act){
    data = act;

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
          center: { lat:data.activityAddress[1], lng: data.activityAddress[0]},
          zoom: 15,
          mayTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  }
  // marker initialization options
  var placeMarker = function(position, map){
    var marker = new google.maps.Marker({
      position: { lat:data.activityAddress[1], lng: data.activityAddress[0]},
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
  // Push 6 Lorem comments to each activity
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
createApp.controller('searchController', ['$scope','$log','$filter','Activity','$http','$rootScope', function($scope, $log, $filter, Activity, $http, $rootScope){
  $scope.search = {};
  // Shows zip on search. Changed on creating an event.
  $scope.hideZip = false;

  // var search;
  var geoLatLng;
  $rootScope.results = [];

    // Use form zipcode to geocode into lat/lng
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

    // Trying to set watch on 'results'
    // set rootScope on line 367 which
    // is probably overiding.
    $scope.$watch('results',function(){
    });

    $scope.$watch('searchValues', function(){});

    // Build search object from form
    // Filter form data into serach object
     var buildSearch = function(geoLatLng, input){
        var date = $filter('date')(input.date, 'yyyy-MM-dd');
        var time = $filter('timeTo24')(input.time);
        var arrayCoords = [geoLatLng.D, geoLatLng.k];
        search = {
          activityDate : date,
          activityTime : time,
          activityDistance : input.distance,
          activityPace : input.pace,
          activityAddress  : arrayCoords
        };
        // Post route to search DB and return results
        $http.post('/api/search', search).success(function(data){
            $scope.searchValues = search;
            $rootScope.results = data;
        }).error(function(data){
        });
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

}]);

createApp.controller('listViewController', ['$scope', function($scope){

}]);

// Create Activity controller
createApp.controller('createController', ['$scope','$filter','$log','$timeout','Activity', function($scope, $filter, $log, $timeout, Activity){

  // Hide zip when creating activity
  $scope.hideZip = true;
  $scope.search = {};
  // Prepare form submission for new DB object
  $scope.publishActivity = function(activityDetails){
    var activity = angular.copy(activityDetails);
    $scope.createActivity.$setPristine();
    $scope.search = {};

    // Filter time to 24hr format
    var time = $filter('timeTo24')(activityDetails.time);

    // Filter date to short date
    var date = $filter('date')(activity.date, 'yyyy-MM-dd');
    // Build timestamp for event
    var buildTimeStamp = date + 'T' + time;

    // Get last marker coordinates
    // Build array of [long,lat]
    var lastCoords = locationSearch();
    var arrayCoords = [lastCoords.longitude , lastCoords.latitude];

    // Setup new Activity object to be saved to DB
    var publish = {
      creator: 'Kevin',
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

setTimeout(function(){
  initialize();
 // Click listener on map to clear markers and add a new one.
  google.maps.event.addListener(map, 'click', function(e){
    if(markers){
      clearMarkers();
    }
    placeMarker(e.latLng, map);
  });
},1000);

 //Geocoder
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

// Create googlemap directive
createApp.directive('googleMaps', function(){
  return {
    restrict: 'E',
    templateUrl: '/templates/googlemap'
  };
});

// Create Sign Up directive
createApp.directive('signup', function(){
  return {
    restrict: 'E',
    templateUrl: '/templates/signUp'
  };
});