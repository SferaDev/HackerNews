import {insertAskPost, insertUrlPost} from "../controllers/postController";
import {getUser, loginUser, registerUser, validateUser} from "../controllers/userController";
import {routes} from "./indexRoutes";

const express = require('express');
const router = express.Router();

routes.forEach(function (doc) {
    router.get(doc.route, function (req, res) {
        validateUser(req.cookies['userToken'], function (decoded) {
            getUser(decoded.userId, function (user) {
                let mainAttributes = {
                    subtitle: doc.title,
                    username: user === null ? undefined : user.username,
                    userScore: user === null ? undefined : user.score
                };
                if (doc.action !== undefined) {
                    doc.action(req, res, function (attributes) {
                        if (attributes !== undefined)
                            Object.assign(mainAttributes, attributes);
                        if (doc.render !== undefined)
                            res.render(doc.render, mainAttributes);
                    });
                } else res.render(doc.render, mainAttributes);
            });
        });
    });
});

router.post('/submit/', function (req, res) {
    validateUser(req.cookies['userToken'], function (decoded) {
        if (req.body.url !== '' && req.body.text === '') {
            insertUrlPost(decoded.userId, req.body.title, req.body.url);
        } else if (req.body.url === '' && req.body.text !== '') {
            insertAskPost(decoded.userId, req.body.title, req.body.text);
        }
        res.redirect('/newest');
    });
});

router.post('/login/', function (req, res) {
    if (req.body.username !== '' && req.body.password !== '') {
        loginUser(req.body.username, req.body.password, function (userToken) {
            if (userToken === null) {
                // TODO: User doesn't exist
            } else {
                res.cookie('userToken', userToken);
            }
            res.redirect('/news');
        });
    }
});

router.post('/register/', function (req, res) {
    if (req.body.username !== '' && req.body.password !== '') {
        registerUser(req.body.username, req.body.password, function (userToken) {
            if (userToken === null) {
                // TODO: User already exist
            } else {
                res.cookie('userToken', userToken);
            }
            res.redirect('/news');
        });
    }
});

module.exports = router;
