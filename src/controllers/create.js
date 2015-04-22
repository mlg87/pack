var Activity = require('../models/activity.js');
var User = require('../models/user.js');

var indexController = {
	createActivity: function(req, res) {
		var newActivity = new Activity(req.body);
    newActivity.save(function(err, results){
      res.send(results);
    });
	},
  createUser: function(req, res){
    var newUser = new User(req.body);

    newUser.save(function(err, results){
      console.log('saved: ', results);
      res.send(results);
    });

  }
};

module.exports = indexController;