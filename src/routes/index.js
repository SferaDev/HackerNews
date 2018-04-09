import {insertAskPost, insertUrlPost} from "../controllers/postController";
import {getCurrentUser, loginUser, registerUser} from "../controllers/userController";

const express = require('express');
const router = express.Router();

const routes = [
    {
        route: '/',
        render: 'news'
    },
    {
        route: '/news/',
        render: 'news'
    },
    {
        route: '/submit/',
        render: 'submit',
        title: 'Submit'
    },
    {
        route: '/guidelines/',
        render: 'guidelines',
        title: 'Guidelines'
    },
    {
        route: '/faq/',
        render: 'faq',
        title: 'FAQ'
    },
    {
        route: '/lists/',
        render: 'lists',
        title: 'Lists'
    },
    {
        route: '/welcome/',
        render: 'welcome',
        title: 'Welcome'
    },
    {
        route: '/login/',
        render: 'login',
        title: 'Login'
    }
];

routes.forEach(function (doc) {
    router.get(doc.route, function (req, res) {
        res.render(doc.render, {
            subtitle: doc.title,
            username: getCurrentUser().username,
            userScore: getCurrentUser().score
        });
    });
});

router.post('/submit/', function (req, res) {
    if (req.body.url !== '' && req.body.text === '' && insertUrlPost(req.body.title, req.body.url))
        res.code = 200;
    else if (req.body.url === '' && req.body.text !== '' && insertAskPost(req.body.title, req.body.text))
        res.code = 200;
    else
        res.code = 500;
});

router.post('/login/', function (req, res) {
    if (req.body.username !== '' && req.body.password !== '' && loginUser(req.body.username, req.body.password))
        res.code = 200;
    else
        res.code = 500;
});

router.post('/register/', function (req, res) {
    if (req.body.username !== '' && req.body.password !== '' && registerUser(req.body.username, req.body.password))
        res.code = 200;
    else
        res.code = 500;
});

module.exports = router;
