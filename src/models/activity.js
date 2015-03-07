var mongoose = require('mongoose');

var activitySchema = mongoose.Schema({
  creator: String,
  activityName: String,
  activityType: String,
});

module.exports = mongoose.model('Activity', activitySchema);

/*
var Activity = function(type, date, time, distance, pace, address, name){
  this.type = type;
  this.date = date;
  this.time = time;
  this.distance = distance;
  this.pace = pace;
  this.address = address;
  this.name = name;
};
*/