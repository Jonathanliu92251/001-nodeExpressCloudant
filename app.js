var express = require('express');
var path = require('path');
var cfenv = require('cfenv');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Cloudant = require('cloudant');


var app = express();

// application routes
var index = require('./routes/index');
var users = require('./routes/users');

var db = connectDB( 'nodetest001' );


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function connectDB( dbName ) {
	var vcapLocal;
	try {
		vcapLocal = require('./vcap-local.json');
		console.log('Loaded local VAP', vcapLocal);
	} catch (e ) {
		console.log( e );
	}

	const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}
	const appEnv = cfenv.getAppEnv( appEnvOpts ) ;

	if ( appEnv.services['cloudantNoSQLDB']) {
		// Load the Cloudant library

		var Cloudant = require('cloudant');

		// Initialize database with credentials
		var cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials) ;

		// Connect database
		db = cloudant.db.use( dbName );
		console.log("db is ", db);
		return  db ;

	}

}

module.exports = app;
