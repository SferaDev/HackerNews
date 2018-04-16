// Dependencies
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import connect_mongo from "connect-mongo";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import logger from "morgan";
import path from "path";

import {indexRouter} from "./src/routes";
import {apiRouter} from "./src/routes/api";

const mongoStore = connect_mongo(session);
const SESSION_SECRET = process.env.SECRET || '%jordi%&%Elena%===Null!';

export const app = express();

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
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: SESSION_SECRET,
    store: new mongoStore({mongooseConnection: mongoose.connection})
}));

// Routes
app.use('/', indexRouter);
app.use('/api', apiRouter);

// Detect errors and forward to 404
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});