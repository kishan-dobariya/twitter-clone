process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./routes');
const mongoDb = require('./helpers/mongoDb');
const app = express();
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const User = require('./models/users.models');
let www = require('./bin/www');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: process.env.SESSION_SECRET}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new Strategy(
	async function (username, password, cb) {
		let user;
		user = await User.getUser({ username: username, password: password});
		if (user == 'Invalid username') {
			return cb(null, false, {message: 'Invalid username'});
		} else if (user == 'Invalid password') {
			return cb(null, false, {message: 'Invalid password'});
		} else if (user == 'Not verified') {
			return cb(null, false, {message: 'Not verified'});
		} else {
			return cb(null, user);
		}
	}
));

passport.serializeUser(function (user, done) {
	done(null, user._id);
});

passport.deserializeUser(async function (id, done) {
	let user = await User.findById(id);
	if (user != null) {
		done(null, user);
	}
});
app.use((req, res, next) => {
  req.io = www.io;
  next();
});

app.use('/', routes);

require('dotenv').config();
//========================== Database Connection =============================//
const mongoURL = mongoDb.makeConnectionString();
console.log(mongoURL);
mongoose.connect(mongoURL);
const db = mongoose.connection;

db.on('connecting', function () {
	console.log(chalk.yellow('connecting to MongoDB...'));
});

db.on('error', function (error) {
	console.log(chalk.red('Error in MongoDb connection: ' + error));
	mongoose.disconnect();
});

db.on('connected', function () {
	console.log(chalk.green(mongoURL + ' => connected'));
});

db.once('open', function () {
	console.log(chalk.green('MongoDB connection opened!'));
});

db.on('reconnected', function () {
	console.log(chalk.blue('MongoDB reconnected!'));
});

app.use(function (req, res, next) {
	req.db = db;
	next();
});

mongoose.Promise = global.Promise;
// =============================================================================

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});
module.exports = app;
