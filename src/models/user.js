var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
  userData: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      require: true,
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  token : String
});

// Hook into pre-save DB flow. Will call callback whenever
// a new user is about to be saved to the database to encrypt.
userSchema.pre('save', function(next){

  // First check to see if the password has been modified.
  // If not, move on.
  if(!this.isModified('password')) return next();

  // Store access to 'this', which represents the current
  // user document
  var user = this;

  // Generate an encryption 'salt'
  bcrypt.genSalt(10, function(err, salt){

    // If error, allow execution to move to the next middleware
    if(err) return next(err);

    // If successful, use the salt to run the encryption on the given password
    bcrypt.hash(user.password, salt, function(err, hash){

      // If error, allow execution to move to next middleware
      if(err) return next(err);

      // If encryption succeeded, then replace the un-encyrpted password in the given document with the newly encrypted one.
      user.password = hash;

      // Allow execution to move on to the next middleware
      return next();
    });

  });
});


/**
 * [comparePassword]
 * Method on the user schema that hooks into the bcyrpt system
 * to compare an encrypted password to a given password.
 * This process doesn't involve unencrypting the stored password,
 * but rather encrypts the given one in the same way and compares thos values.
 */
userSchema.methods.comparePassword = function(candidatePassword, next){
  // Use bcrypt to compare the unencrypted value to the encrypted one in the DB
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    // If there was an error, allow execution to move to the next middleware
    if(err) return next(err);

    // If there is no error, move to the next middleware and
    // inform it of the match status(true or false)
    return next(null, isMatch);
  });
};


module.exports = mongoose.model('User', userSchema);