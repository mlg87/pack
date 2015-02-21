var _ = require('underscore');

var localEvents = [];
var latLngRadius = [];
var markers = [];
var lastSearchForm = [];

var User = function(fName, lName, email, password, birthday, favActivities) {
  this.fName = fName;
  this.lName = lName;
  this.email = email;
  this.password = password;
  this.birthday = birthday;
  this.favActivities = [];
  this.rating = 0;
  this.events = [];
  this.search = [];
};

var users = [
new User('Jenna', 'Schuchard', 'Jenna@gmail.com', 'jennapass', '3/23/84', 'Running'),
new User('Ben', 'Linderman', 'Ben@gmail.com', 'benpass', '01/29/87', 'Running, Cycling'),
new User('Adam', 'Dodson', 'Adam@gmail.com', 'adampass', '4/23/84', 'Running'),
new User('Chris', 'Dureaux', 'Chris@gmail.com', 'chrispass', '01/29/87', 'Running, Cycling'),
new User('Roy', 'Tamez', 'Roy@gmail.com', 'roypass', '4/23/84', 'Running'),
new User('Michael', 'Akaydin', 'Michael@gmail.com', 'michaelpass', '01/29/87', 'Running, Cycling'),
new User('Maggie', 'Akaydin', 'Maggie@gmail.com', 'maggiepass', '4/23/84', 'Running'),
new User('Troy', 'Templin', 'Troy@gmail.com', 'troypass', '01/29/87', 'Running, Cycling'),
new User('Brandon', 'Lowrey', 'Brandon@gmail.com', 'brandonpass', '4/23/84', 'Running'),
new User('Chase', 'Schuchard', 'chase@gmail.com', 'chasepass', '01/29/87', 'Running, Cycling'),
new User('Cameron', 'Crouse', 'Cameron@gmail.com', 'cameronpass', '4/23/84', 'Running'),
new User('Sam', 'Miller', 'Sam@gmail.com', 'sampass', '01/29/87', 'Running, Cycling'),
new User('Kylie', 'Schuchard', 'Kylie@gmail.com', 'kyliepass', '4/23/84', 'Running')
];


User.prototype.addSearch = function(){
  this.search = this.search.concat([].slice.call(arguments));
};

User.prototype.addEvent = function(){
  this.events = this.events.concat([].slice.call(arguments));
};

User.prototype.lastSearch = function (){
 lastSearchForm =  _.last(this.search);
};

var Activity = function(type, date, time, distance, pace, address, name){
  this.type = type;
  this.date = date;
  this.time = time;
  this.distance = distance;
  this.pace = pace;
  this.address = address;
  this.name = name;
};

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

var matchActivity = function (type, date, time, distance, pace, address){
console.log('submit');
};

module.exports = {
  globalEvents : globalEvents,
  localEvents : localEvents,
  latLngRadius : latLngRadius,
  markers : markers,
  lastSearchForm : lastSearchForm,
  users : users,
  matchActivity : matchActivity
};