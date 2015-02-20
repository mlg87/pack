var mapCenterLocation;

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
    } else {
      alert('Please enter a zip code');
      }
  });
};

module.exports = {
  initialize : initialize,
  codeAddress : codeAddress
};