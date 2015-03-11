var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }

});

module.exports = mongoose.model('User', userSchema);

/*
var User = function(fName, lName, email, password, birthday, sex) {
  this.fName = fName;
  this.lName = lName;
  this.email = email;
  this.password = password;
  this.birthday = birthday;
  this.sex = sex;
  this.rating = 0;
  this.events = [];
  this.friends = [];
};

 */