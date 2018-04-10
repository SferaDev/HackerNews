import {insertAskPost, insertUrlPost} from "../controllers/postController";
import {getUser, loginUser, registerUser} from "../controllers/userController";

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
    },
    {
        route: '/register/',
        render: 'login',
        title: 'Login'
    }
];

routes.forEach(function (doc) {
    router.get(doc.route, function (req, res) {
        getUser(req.cookies['userId'], function (err, user) {
            if (err) res.code = 500;
            else res.render(doc.render, {
                subtitle: doc.title,
                username: user === null ? undefined : user.username,
                userScore: user === null ? undefined : user.score,
                posts: [
                    {
                        id: 123,
                        title: 'Swaggaaa is a fake',
                        url: 'https://github.com/swaggaaa',
                        owner: 'alexis',
                        points: 459,
                        comments: 76
                    },
                    {
                        id: 124,
                        title: 'Elena is not found',
                        url: 'https://github.com/elenika',
                        owner: 'alexis',
                        points: 988,
                        comments: 765
                    },
                    {
                        id: 125,
                        title: 'Jordi doesn\'t receive any mails',
                        url: 'https://github.com/jordi987',
                        owner: 'alexis',
                        points: 0,
                        comments: 0
                    }
                ]
            });
        });
    });
});

router.get('/logout/', function (req, res) {
    res.clearCookie('userId');
    res.redirect('/news');
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
    console.log("DEBUG: " + req.body.username);
    if (req.body.username !== '' && req.body.password !== '') {
        loginUser(req.body.username, req.body.password, function (err, userId) {
            if (err) res.code = 500;
            if (userId === null) {
                // TODO: User doesn't exist
            } else {
                res.cookie('userId', userId);
                res.redirect('back');
            }
        });
    } else
        res.code = 500;
});

router.post('/register/', function (req, res) {
    if (req.body.username !== undefined && req.body.password !== undefined) {
        registerUser(req.body.username, req.body.password, function (err, userId) {
            if (err) res.code = 500;
            else if (userId === null) {
                // TODO: User already exists
            } else {
                res.cookie('userId', userId);
                res.redirect('back');
            }
        });
    } else
        res.code = 500;
});

module.exports = router;
