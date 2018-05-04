import express from "express";
import yaml from 'yamljs';
import swaggerUi from 'swagger-ui-express';

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

// API Users endpoint
apiRouter.use('/users', usersApiRouter);

// Error Callback function
export const messageCallback = function (res, code, message) {
    res.status(code).send({
        success: code === httpCodes.STATUS_OK || code === httpCodes.STATUS_CREATED,
        message: message
    });
};