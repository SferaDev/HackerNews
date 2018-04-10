// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const logger = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

// Connect to the database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/HackerNews';
mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI, function (error) {
    if (error) console.error(error);
    else console.log('MongoDB connected');
});

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./src/routes/index'));
app.use('/api', require('./src/routes/api'));

// Detect errors and forward to 404
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
