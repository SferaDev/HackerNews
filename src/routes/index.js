import {getAllPosts, insertAskPost, insertUrlPost} from "../controllers/postController";
import {getUser, loginUser, registerUser, validateUser} from "../controllers/userController";

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
        validateUser(req.cookies['userToken'], function (decoded) {
            getUser(decoded.userId, function (user) {
                getAllPosts(function (posts) {
                    res.render(doc.render, {
                        subtitle: doc.title,
                        username: user === null ? undefined : user.username,
                        userScore: user === null ? undefined : user.score,
                        posts: posts
                    });
                });
            });
        });
    });
});

router.get('/logout/', function (req, res) {
    res.clearCookie('userToken');
    res.redirect('/news');
});


router.post('/submit/', function (req, res) {
    validateUser(req.cookies['userToken'], function (decoded) {
        if (req.body.url !== '' && req.body.text === '') {
            insertUrlPost(decoded.userId, req.body.title, req.body.url);
        } else if (req.body.url === '' && req.body.text !== '') {
            insertAskPost(decoded.userId, req.body.title, req.body.text);
        }
        res.redirect('back');
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
            res.redirect('back');
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
            res.redirect('back');
        });
    }
});

module.exports = router;
