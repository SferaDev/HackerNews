var express = require('express');
var router = express.Router();

var routes = [
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
    router.get(doc.route, function (req, res, next) {
        res.render(doc.render, {
            subtitle: doc.title,
            username: 'Swaggaaa', // TODO: Hard-coded beef
            userScore: 1337
        });
    });
});

module.exports = router;
