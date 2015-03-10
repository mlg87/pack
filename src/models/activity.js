var mongoose = require('mongoose');

var activitySchema = mongoose.Schema({
  creator: String,
  activityName: String,
  activityType: String,
  activityDate: String,
  activityTime: String,
  activityPace: String,
  activityDistance: String,
  activityAddress: {
    lat: Number,
    lng: Number,
  },
  activityDescption: String,
  // activityParticipants: {}
  // activityComments: {}

});

module.exports = mongoose.model('Activity', activitySchema);
