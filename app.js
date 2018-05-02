import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import connect_mongo from "connect-mongo";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import logger from "morgan";
import path from "path";
import cors from "cors";
import passport from "passport";
import {Strategy as GithubStrategy} from "passport-github2";

import {indexRouter} from "./src/routes";
import {apiRouter} from "./src/routes/api";
import {userModel} from "./src/models/user";

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
app.locals.pretty = true;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: SESSION_SECRET,
    store: new mongoStore({mongooseConnection: mongoose.connection})
}));
app.use(cors());

if (process.env.GITHUB_CLIENT_ID) {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        callbackURL: process.env.GITHUB_CALLBACK_URL || '',
        scope: ['user:email']
    }, function (accessToken, refreshToken, profile, next) {
        userModel.findOneOrCreate({githubId: profile.id, username: profile.username, email: profile.emails[0].value}, function (err, user) {
            if (err) return next(err);
            return next(err, user);
        });
    }));

    app.get('/auth', passport.authenticate('github'));

    app.get('/auth/callback',
        passport.authenticate('github', { failureRedirect: '/' }),
        function(req, res) {
            req.session.userId = req.session.passport.user._id;
            req.session.username = req.session.passport.user.username;
            req.session.isAdmin = req.session.passport.user.isAdmin;
            res.redirect(req.session.returnTo !== undefined ? req.session.returnTo : '/');
        });

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        done(null, user);
    });
}

// Routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/docs', express.static('apidoc'));

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
