var User = require('../models/user.js');
var Activity = require('../models/activity.js');


var findController = {

  getAll: function(req, res){
    if(req.query._id){
      // If there is a query parameter for _id,
      // get an individual item:
      Activity.findById(req.query._id, function(err, result){
        if(err){
          console.log('error from findById Activity', err);
        }
        res.send(result);
      });
    } else {
      // else, get all items
      // Go to DB and find all news items
      Activity.find({} , function(err, results){
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
  },

  search: function(req, res){
    Activity.find({
      activityAddress:{
        $near:{
          $geometry: {
            type: "Point",
            coordinates : [req.body.activityAddress[0], req.body.activityAddress[1]],
          },
          $maxDistance: 8000,
        }
      },
      activityDistance : req.body.activityDistance,
      activityDate : req.body.activityDate,
      activityPace: req.body.activityPace,
      activityTime : req.body.activityTime
    }).exec(function(err, locations){
      if(err){
        console.log('server error: ', err);
        return res.json(500, err);
      }
      res.status(200).send(locations);
      // Deprecated
      // res.send(200, locations);
    });

  }
};

module.exports = findController;
