var User = require('../models/user');

// seed a user
var user = new User({
  username: 'kbs',
  email: 'kbs177@gmail.com',
  password: 'test'
});

// user.save(function(err, user){
//   if(err){
//     console.log(err);
//   } else {
//     console.log('Seeded user');
//   }
// });