var express = require('express');
var bodyParser = require('body-parser');

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

// Seed the DB with activities
require('./models/seeds/activitySeeds.js');

var indexController = require('./controllers/index.js');
var findController = require('./controllers/find.js');
var createController = require('./controllers/create.js');
var authenticationController = require('./controllers/authenticate');

mongoose.connect('mongodb://localhost/pack');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Add cookieParser and flash middleware.
app.use(cookieParser());
app.use(flash());

// Initialize the express session. Needs to be given a secret property.
// Also requires the resave option (will not force a resave of session if not modified)
// as well as saveUninitialized(will not automatically create empty data)
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

app.get('/', indexController.index);

// Hook in passport to the middleware chain
app.use(passport.initialize());

// Hook in the passport session management into the middleware chain.
app.use(passport.session());

// Our get request for viewing the login page
app.get('/auth/login', authenticationController.login);

// Post received from submitting the login form
app.post('/auth/login', authenticationController.processLogin);

// Api-specific routes:
app.get('/api/view', findController.getAll);
app.post('/api/view', createController.create);

// Templates route:
app.get('/templates/:templateid', indexController.getTemplate);

var server = app.listen(3001, function() {
	console.log('Express server listening on port ' + server.address().port);
});
