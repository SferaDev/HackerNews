var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('template', {
        title: 'News4Hackers',
        username: 'Swaggaaaa', // TODO: Hard-coded beef
        userScore: 1337
    });
});

module.exports = router;
