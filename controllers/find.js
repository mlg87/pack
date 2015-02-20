var indexController = {

  initialize: function(req, res){
    res.render('find');
    google.maps.event.addDomListener(window, 'load', initialize);
  }

};

module.exports = indexController;