var User = require('../user.js');

User.find({}, function(err, results){
  if(results.length === 0){
    var user1 = new User({

    });

  }
});

/*
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
*/