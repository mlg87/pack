var Activity = require('../models/activity.js');

var indexController = {
	create: function(req, res) {
		var newActivity = new Activity(req.body);
    newActivity.save(function(err, results){
      res.send(results);
    });
	}
};

module.exports = indexController;