var Activity = require('../activity.js');

Activity.find({}, function(err, results){
  if(results.length === 0){

      var item1 = new Activity({
        creator: 'Jenna',
        activityName: 'Lunch run',
        activityType: 'run',
        activityDate: '02/13/2015',
        activityTime: '5:00 PM',
        activityPace: '3',
        activityDistance: '9:30',
        activityAddress: {
          lat: 40.014955,
          lng: -105.214863
        },
        activityDescption: 'Lets run at lunch today!',
      });
      item1.save();

  }
});

/*
var globalEvents = [
  new Activity('Running', '02/13/2015', '5:00 PM', '3', '9:30', {lat: 40.014955, lng: -105.214863},'Jenna'),
  new Activity('Running', '02/13/2015', '5:30 PM', '4', '7:30', {lat: 39.99911734033355, lng: -105.28239011764526},'Ben'),
  new Activity('Running', '02/13/2015', '5:45 PM', '4', '7:30', {lat: 39.997190, lng: -105.211430}, 'Adam'),
  new Activity('Running', '02/17/2015', '6:30 PM', '7', '8:30', {lat: 39.9911734033355, lng: -105.2829011764526},'Chris'),
  new Activity('Running', '02/16/2015', '1:30 PM', '12', '8:30', {lat: 40.025710, lng: -105.254602}, 'Roy'),
  new Activity('Running', '02/13/2015', '5:30 PM', '4', '7:40', {lat: 39.99911734013355, lng: -105.28219011764526},'Michael'),
  new Activity('Running', '02/13/2015', '5:30 PM', '3', '9:30', {lat: 40.997390, lng: -105.261430}, 'Maggie'),
  new Activity('Running', '02/13/2015', '5:30 PM', '3', '8:30', {lat: 40.055099, lng: -105.288001}, 'Troy'),
  new Activity('Running', '02/13/2015', '5:30 PM', '4', '7:30', {lat: 39.736056, lng: -105.026314}, 'Brandon'),
  new Activity('Running', '02/13/2015', '5:30 PM', '2', '9:30', {lat: 39.733600, lng: -104.967027}, 'Phil'),
  new Activity('Running', '02/13/2015', '5:30 PM', '10', '9:30', {lat: 39.752703, lng: -105.045390}, 'Cameron'),
  new Activity('Running', '02/13/2015', '5:30 PM', '8', '6:30', {lat: 39.746041, lng: -104.954538}, 'Sam'),
  new Activity('Running', '02/13/2015', '5:30 PM', '2', '9:30', {lat: 39.715920, lng: -104.958669}, 'Kylie')
];
*/