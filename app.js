var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');

//var bcrypt = require('bcrypt-nodejs');

//var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var session_controller = require('./server_scripts/session.js');

// New Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost/srf'); // 0.0.0.0:27017 = localhost

var index = require('./routes/index');
var oven = require('./routes/oven');
var auth = require('./routes/auth');

var app = express();

//for auth
//var passport = require('passport');
var flash = require('connect-flash');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

//app.use(express.cookieParser('ThIsAS3CrE7'));
//app.use(express.cookieSession());
//app.use(cookieParser);
//app.use(session);

app.use(session({
    name: 'ProT3CteDSeSs',
    keys: ['The1STK3Y', 'THESeCoNDKEY'],
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(function(req,res,next){
    req.session_controller = session_controller;
    next();
});

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});


app.use('/', index);
app.use('/auth', auth);
app.use('/oven', oven);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;