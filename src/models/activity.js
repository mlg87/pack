var mongoose = require('mongoose');

var activitySchema = mongoose.Schema({
  creator: String,
  activityName: String,
  activityDate: String,
  activityTime: String,
  activityDistance: String,
  activityPace: String,
  activityAddress: {
    lat: Number,
    lng: Number,
  },
  activityDescription: String,
  activityTimeStamp: String,
  // activityParticipants: {},
  // activityComments: {}

});

module.exports = mongoose.model('Activity', activitySchema);
