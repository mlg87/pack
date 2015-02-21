/* Initialize Google Map on window load */
var geocoder;
var initialize = function () {
  // var map;
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

/* Add custom calendar settings */
var calendarPick = function(){
  $('.datePick').datepicker({
    startDate: "today",
    autoclose: true,
    todayHighlight: true,
  });
};

/* Initialize Time Picker module */
var timePick = function (){
  $('#timePicker').timepicker();
};

/* Gets form data */
var getForm = function (){
  // Create new Activity to add to User's Search array
  var date = $('.datePick').datepicker("getDate");
  var sType = $('#activityDropMenu').text();
  var sDate = $('#datePick').val();
  var sTime = $('#timePicker').val();
  var sDistance = $('#distance').val();
  var sPace = $('#pace').val();
  var sAddress = $('#address').val();

      // Move this to Model
      var input = new Activity(sType, sDate, sTime, sDistance, sPace, sAddress);
      // Add form data to User search array
      kevin.addSearch(input);
};

/* Converts 12 hour (HH:MM) time to 24 hour time. */
var timeConvert = function(time){
  var hours = parseInt(time.substr(0, 2));
    if(time.indexOf('AM') != -1 && hours == 12) {
        time = time.replace('12', '0');
    }
      if(time.indexOf('PM')  != -1 && hours < 12) {
          time = time.replace(hours, (hours + 12));
      }
        return time.replace(/(AM|PM)/, '');
};

/* Converts 24 hour (HH:MM) time to seconds. */
var timeToSeconds = function(time){
  var t = time.split(':');
    if(t.length > 1){
      return t[0]*3600+t[1]*60;
    }
      else if(t.length < 1){
        return t[0]*60;
      }
};

/* Converts pace (MM:SS) into seconds */
var paceConvert = function (time){
  if(time.length === 1){
    return time*60;
  }
  else {
    var t = time.split(':');
    if(t.length > 2){
      return t[0]*3600+t[1]*60+t[2]*1;
    }
      else if(t.length < 3){
        return t[0]*60+t[1]*1;
      }
  }
};

$(document).on('ready', function(){
  /* Load Google Maps */
  google.maps.event.addDomListener(window, 'load', initialize);

  /* Initialize calendar */
  calendarPick();

  /* Initialize Time Picker when field is clicked */
  $('#timePicker').on('click', function(){
    timePick();
  });

  /* Change Activity tab to User's selection. */
  $('.form-group').on('click', 'li', function() {
    $('#activityDropMenu').text($(this).text());
  });

  /* Add's User's search to their Search array and filter results. */
  $('#searchSubmit').on('click', 'button', function(e){
    e.preventDefault();
    codeAddress();
    // getForm();
    // kevin.searchRadius();
  });
});