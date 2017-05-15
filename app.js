
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var data = require('./public/javascripts/core.js');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(express.bodyParser());

app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


// this part of the program sets up the routes for each GET / POST / DELETE / PUT API methods
// PUT/POST call same method due to records either pre-existing or not (determined in query)
// Delete and Update methods not necessary

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/candidates', data.getCandidatesVotes);
app.post('/candidates/:candidateid/:voterid', data.addVote);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
