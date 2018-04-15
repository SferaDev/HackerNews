import {getAllPosts, insertAskPost, insertUrlPost} from "../controllers/postController";
import {getUser, loginUser, registerUser, validateUser} from "../controllers/userController";

const express = require('express');
const router = express.Router();

const routes = [
    {
        route: '/',
        render: 'news',
        implementation: function (req, res, result) {
            getAllPosts(function (posts) {
                result({posts: posts.filter(post => post.__type === "Url")});
            });
        }
    },
    {
        route: '/news/',
        render: 'news',
        implementation: function (req, res, result) {
            getAllPosts(function (posts) {
                result({posts: posts.filter(post => post.__type === "Url")});
            });
        }
    },
    {
        route: '/newest/',
        render: 'news',
        implementation: function (req, res, result) {
            getAllPosts(function (posts) {
                result({
                    posts: posts.sort(function compare(a, b) {
                        if (a.createdAt < b.createdAt)
                            return 1;
                        else if (a.createdAt > b.createdAt)
                            return -1;

                        return 0;
                    })
                });
            });
        }
    },
    {
        route: '/submit/',
        render: 'submit',
        title: 'Submit',
        implementation: function (req, res, result) {
            result();
        }
    },
    {
        route: '/guidelines/',
        render: 'guidelines',
        title: 'Guidelines',
        implementation: function (req, res, result) {
            result();
        }
    },
    {
        route: '/faq/',
        render: 'faq',
        title: 'FAQ',
        implementation: function (req, res, result) {
            result();
        }
    },
    {
        route: '/lists/',
        render: 'lists',
        title: 'Lists',
        implementation: function (req, res, result) {
            result();
        }
    },
    {
        route: '/welcome/',
        render: 'welcome',
        title: 'Welcome',
        implementation: function (req, res, result) {
            result();
        }
    },
    {
        route: '/login/',
        render: 'login',
        title: 'Login',
        implementation: function (req, res, result) {
            result();
        }
    },
    {
        route: '/register/',
        render: 'login',
        title: 'Login',
        implementation: function (req, res, result) {
            result();
        }
    }
];

routes.forEach(function (doc) {
    router.get(doc.route, function (req, res) {
        validateUser(req.cookies['userToken'], function (decoded) {
            getUser(decoded.userId, function (user) {
                doc.implementation(req, res, function (properties) {
                    let attributes = {
                        subtitle: doc.title,
                        username: user === null ? undefined : user.username,
                        userScore: user === null ? undefined : user.score
                    };

                    for (let prop in properties) {
                        if (properties.hasOwnProperty(prop)) {
                            attributes[prop] = properties[prop];
                        }
                    }
                    res.render(doc.render, attributes);
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
