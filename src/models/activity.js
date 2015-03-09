var mongoose = require('mongoose');

var activitySchema = mongoose.Schema({
  creator: String,
  activityName: String,
  activityType: String,
});

module.exports = mongoose.model('Activity', activitySchema);

/*
var Activity = function(type, date, time, description, distance, pace, address, activityName){
  this.userId = userId
  this.type = type;
  this.date = date;
  this.time = time;
  this.description = description;
  this.distance = distance;
  this.pace = pace;
  this.address = address;
  this.activityName = activityName;
  this.comments = {}
};
*/