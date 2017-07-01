var express	=	require('express');
var session	=	require('express-session');
var bodyParser  = 	require('body-parser');
var passport = require('passport');
var async = require('async');
var app	= express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var LocalStrategy   = require('passport-local').Strategy;
app.use(bodyParser.urlencoded({ extended: false }));
var router = express.Router();
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/",router);
app.use(express.static('views'));
app.set('view engine', 'ejs');
var path = __dirname + '/views/';

var connection = require('./app/config');  // added connection file
var routes = require('./app/routes')(app);  // added router file
var post = require('./app/users')(app);    // added post method file

var port = process.env.PORT || 1337;
http.listen(port);
