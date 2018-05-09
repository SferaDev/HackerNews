import express from "express";
import yaml from 'yamljs';
import swaggerUi from 'swagger-ui-express';

import {commentsApiRouter} from "./api/users";
import {postsApiRouter} from "./api/users";
import {usersApiRouter} from "./api/users";
import {userModel} from '../models/user';
import * as httpCodes from '../utils/httpCodes';

export const apiRouter = express.Router();

// Middleware that serves swagger-ui to /api/docs
apiRouter.use('/docs', swaggerUi.serve, swaggerUi.setup(yaml.load('./api/api.yaml')));

// Middleware to verify user API key
apiRouter.use(function (req, res, next) {
    let key = req.query.key || req.headers['key'];
    if (key) {
        userModel.findOne({apiKey: key}, function (err, user) {
            if (err) return messageCallback(res, httpCodes.STATUS_SERVER_ERROR, 'Server error');
            else if (user == null) return messageCallback(res, httpCodes.STATUS_UNAUTHORIZED, 'Please provide a valid API key');
            req.user = user;
            next();
        });
    } else return messageCallback(res, httpCodes.STATUS_UNAUTHORIZED, 'Please provide a valid API key');
});

// Middleware to prettify/filter/sort JSON result
apiRouter.use(function (req, res, next) {
    let oldSend = res.send;
    res.set('Content-Type', 'application/json');
    res.send = function (obj) {
        if (typeof obj === 'object') {
            let attributes = req.query.filter ? req.query.filter.split(',') : null;
            let indent = !isNaN(parseInt(req.query.indent)) && parseInt(req.query.indent) >= 0 ? parseInt(req.query.indent) : 0;
            if (Array.isArray(obj) && req.query.sort) {
                obj.sort(function (a, b) {
                    if (a[req.query.sort] > b[req.query.sort]) return 1;
                    else if (a[req.query.sort] < b[req.query.sort]) return -1;
                    return 0;
                });
            }
            oldSend.call(this, JSON.stringify(obj, attributes, indent));
        } else oldSend.call(this, obj);
    };
    next();
});

// Root route to validate token
apiRouter.get('/', function (req, res) {
    messageCallback(res, 200, 'Welcome to the News4Hackers API!');
});

// API Users endpoint
apiRouter.use('/comments', commentsApiRouter);
apiRouter.use('/posts', postsApiRouter);
apiRouter.use('/users', usersApiRouter);

// Default route to return Not found error
apiRouter.get('*', function (req, res) {
    messageCallback(res, 404, 'Route not found');
});

// Error Callback function
export const messageCallback = function (res, code, message) {
    res.status(code).send({
        success: code === httpCodes.STATUS_OK || code === httpCodes.STATUS_CREATED,
        message: message
    });
};
