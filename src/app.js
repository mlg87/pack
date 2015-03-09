var express = require('express');
var bodyParser = require('body-parser');

var indexController = require('./controllers/index.js');
var findController = require('./controllers/find.js');
var createController = require('./controllers/create.js');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pack');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', indexController.index);
app.get('/find', findController.initialize);
app.post('/search', findController.searchForm);
app.get('/create', createController.create);

var server = app.listen(3001, function() {
	console.log('Express server listening on port ' + server.address().port);
});
