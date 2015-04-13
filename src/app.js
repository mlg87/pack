var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
// Database persistance
var mongoose = require('mongoose');

// Keep track of cookies of user across multiple pages.
var session = require('express-session');
// Load cookies
var cookieParser = require('cookie-parser');

// Store quick one-time-use messages between views that remove
// once used. Error messages.
var flash = require('connect-flash');

// Loade bass passport library.
var passport = require('passport');

// See users to DB
var passportConfig = require('./config/passport');

// +++++++++++ Token auth
var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');


// Seed the DB with activities
require('./models/seeds/activitySeeds.js');

var indexController = require('./controllers/index.js');
var findController = require('./controllers/find.js');
var createController = require('./controllers/create.js');
var authenticationController = require('./controllers/authenticate.js');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/pack');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// Add cookieParser and flash middleware.
app.use(cookieParser());
app.use(flash());

// Initialize the express session. Needs to be given a secret property.
// Also requires the resave option (will not force a resave of session if not modified)
// as well as saveUninitialized(will not automatically create empty data)
app.use(session({
  secret: 'secret',
  cookie: {
    maxAge: new Date(Date.now() + 14*24*60*60*1000), // 14 days, in milliseconds
    expires: new Date(Date.now() + 14*24*60*60*1000) // 14 days, in milliseconds
  },
  resave: false,
  saveUninitialized: false
}));

var auth = function(req, res, next){
  if (!req.isAuthenticated())
    res.send(401);
  else
    next();
};

// Hook in passport to the middleware chain
app.use(passport.initialize());

// Hook in the passport session management into the middleware chain.
app.use(passport.session());

// +++++++++++ Protect /api routes with JWT
app.use('/api', expressJwt({secret: 'secret'}));
app.use(bodyParser.json());

app.get('/', indexController.index);


// +++++++++++
app.post('/authenticate', function (req, res) {
  //TODO validate req.body.username and req.body.password
  //if is invalid, return 401
  if (!(req.body.username === 'john.doe' && req.body.password === 'foobar')) {
    res.send(401, 'Wrong user or password');
    return;
  }

  var profile = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@doe.com',
    id: 123
  };

  // We are sending the profile inside the token
  var token = jwt.sign(profile, secret, { expiresInMinutes: 60*5 });

  res.json({ token: token });
});

app.get('/api/restricted', function (req, res) {
  console.log('user ' + req.user.email + ' is calling /api/restricted');
  res.json({
    name: 'foo'
  });
});





app.get('/users',
  passportConfig.ensureAuthenticated,
  function(req, res){
  res.send([{name: "user1"}, {name: "user2"}]);
});

// TEST IF THE USER IS LOGGED IN
app.get('/loggedin', function(req, res) {
  res.send(req.isAuthenticated() ? req.user : '0');
});

// ROUTE TO LOG IN
app.post('/login',
  authenticationController.processLogin,
  function(req, res) {
    res.send(req.user);
});

// ROUTE TO LOG OUT
app.post('/logout', function(req, res){
  req.logOut();
  res.send(200);
});

// Api-specific routes:
app.get('/api/view', findController.getAll);
app.post('/api/view', createController.create);
app.post('/api/search', findController.search);

// Templates route:
app.get('/templates/:templateid', indexController.getTemplate);

var port = process.env.PORT || 3001;

var server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});
