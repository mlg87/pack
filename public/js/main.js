/* Initialize Google Map on window load */
var initialize = function () {
  // var geocoder;
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

/* Calendar Settings */
var calendarPick = function(){
  $('.datePick').datepicker({
    startDate: "today",
    autoclose: true,
    todayHighlight: true,
  });
};

/* Time picker settings */
var timePick = function (){
  $('#timePicker').timepicker();
};

// Converts 12 hour time to 24 hour time.
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

// Converts 24 hour time to seconds.
var timeToSeconds = function(time){
  var t = time.split(':');
    if(t.length > 1){
      return t[0]*3600+t[1]*60;
    }
      else if(t.length < 1){
        return t[0]*60;
      }
};

// Converts pace into seconds
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
  google.maps.event.addDomListener(window, 'load', initialize);
  calendarPick();
  timePick();
});