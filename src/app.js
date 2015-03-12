var express = require('express');
var bodyParser = require('body-parser');

var indexController = require('./controllers/index.js');
var findController = require('./controllers/find.js');
var createController = require('./controllers/create.js');

// Connect to DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pack');
// Seed the DB
require('./models/seeds/activitySeeds.js');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', indexController.index);
// app.get('/find', findController.initialize);
// app.get('/create', createController.create);

// Api-specific routes:
app.get('/api/view', findController.getAll);

// Templates route:
app.get('/templates/:templateid', indexController.getTemplate);

var server = app.listen(3001, function() {
	console.log('Express server listening on port ' + server.address().port);
});