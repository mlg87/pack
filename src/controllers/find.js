var User = require('../models/user.js');
var Activity = require('../models/activity.js');


var findController = {

  // initialize: function(req, res){
  //   res.render('find', {
  //     users: user.users,
  //     globalEvents : user.globalEvents,
  //     push : user.push
  //   });
  // },

  // searchForm: function(req, res){
  //   var matches = [];
  //   matches = user.matchActivity(
  //     req.body.type,
  //     req.body.date,
  //     req.body.time,
  //     req.body.distance,
  //     req.body.pace,
  //     req.body.address
  //   );
  //   // deleteMarkers();
  //   // user.displayMatches(matches)
  // },

  getAll: function(req, res){
    console.log('request: ', req);
    if(req.query._id){
      // If there is a query parameter for _id,
      // get an individual item:
      Activity.findById(req.query._id, function(err, result){
        if(err){
          console.log('error from findById Activity', err);
        }
        res.send(result);
      });
    // } else if(req.query.obj) {

    //   Activity.find({activityTime : obj.df }, function(err, results){
    //     // Send the entire array of results
    //     // to the client as JSON
    //     res.send(results);
    //   });
    } else {
      // else, get all items
      // Go to DB and find all news items
      Activity.find({}, function(err, results){
        // Send the entire array of results
        // to the client as JSON
        res.send(results);
      });
    }
  },

  findUser: function(req, res){
    if(req.query._id){
      User.findById(req.query._id, function(err, results){
        if(err){
          console.log('error from findById User', err);
        }
        res.send(results);
      });
    }
  }
};

module.exports = findController;
