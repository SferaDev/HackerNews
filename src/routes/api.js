import {userModel} from "../models/user";

const express = require('express');
export const apiRouter = express.Router();

apiRouter.get('/', function (req, res) {
    if (req.session.page_views) {
        req.session.page_views++;
        res.send("You visited this page " + req.session.page_views + " times");
    } else {
        req.session.page_views = 1;
        res.send("Welcome to this page for the first time!");
    }
});

/**
 * @api {get} /users List all users
 * @apiVersion 1.0.0
 * @apiGroup Users
 *
 * @apiSuccess {JSON} result Array with all users
 */
apiRouter.get('/users', function(req, res) {
    userModel.find({}, {
        _id: 0,
        username: 1,
        karma: 1,
        email: 1
    }, function (err, users) {
        if (err) res.status(500).send(err);
        else {
            users.forEach(user => {if (user.email === '') delete user.email});
            res.status(200).send(users);
        }
    });
});
