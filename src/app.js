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

app.get('/', indexController.index);
// app.get('/find', findController.initialize);
// app.get('/create', createController.create);

// Api-specific routes:
app.get('/api/view', findController.getAll);
app.post('/api/view', createController.create);

// Templates route:
app.get('/templates/:templateid', indexController.getTemplate);

var server = app.listen(3001, function() {
	console.log('Express server listening on port ' + server.address().port);
});
