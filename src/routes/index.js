const express = require('express');
const router = express.Router();

const postController = require('../controllers/postController');

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
    }
];

routes.forEach(function (doc) {
    router.get(doc.route, function (req, res) {
        res.render(doc.render, {
            subtitle: doc.title,
            username: 'Swaggaaa', // TODO: Hard-coded beef
            userScore: 1337
        });
    });
});

router.post('/submit/', function (req, res) {
    if (req.body.url !== '' && req.body.text === '')
        postController.insertUrlPost(req.body.title, req.body.url);
    else if (req.body.url === '' && req.body.text !== '')
        postController.insertAskPost(req.body.title, req.body.text);
    else
        res.code = 500;
});

module.exports = router;
