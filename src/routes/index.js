import {insertAskPost, insertUrlPost} from "../controllers/postController";
import {getUser, loginUser, registerUser} from "../controllers/userController";
import {routes} from "./indexRoutes";

const express = require('express');
export const indexRouter = express.Router();

routes.forEach(function (doc) {
    indexRouter.get(doc.route, function (req, res) {
        getUser(req.session.userId, function (user) {
            let mainAttributes = {
                subtitle: doc.title,
                username: user === null ? undefined : user.username,
                karma: user === null ? undefined : user.karma
            };
            if (doc.action !== undefined) {
                doc.action(req, res, function (attributes) {
                    if (attributes !== undefined)
                        Object.assign(mainAttributes, attributes);
                    if (doc.render !== undefined)
                        res.render(doc.render, mainAttributes);
                });
            } else if(doc.render !== undefined) res.render(doc.render, mainAttributes);
        });
    });
});

indexRouter.post('/submit/', function (req, res) {
    if (req.body.url !== '' && req.body.text === '') {
        insertUrlPost(req.session.userId, req.body.title, req.body.url);
    } else if (req.body.url === '' && req.body.text !== '') {
        insertAskPost(req.session.userId, req.body.title, req.body.text);
    }
    res.redirect('/newest');
});

indexRouter.post('/login/', function (req, res) {
    if (req.body.username !== '' && req.body.password !== '') {
        loginUser(req.body.username, req.body.password, function (userId) {
            if (userId === null) {
                // TODO: User already exist
            } else {
                req.session.userId = userId;
                req.session.username = req.body.username;
            }
            res.redirect('/news');
        });
    }
});

indexRouter.post('/register/', function (req, res) {
    if (req.body.username !== '' && req.body.password !== '') {
        registerUser(req.body.username, req.body.password, function (userId) {
            if (userId === null) {
                // TODO: User already exist
            } else {
                req.session.userId = userId;
                req.session.username = req.body.username;
            }
            res.redirect('/news');
        });
    }
});