var express = require('express');
var router = express.Router();
var utils = require('../model/utils');

/* GET home page. */
router.route('/')
    .get(function (req, res, next) {
        var user = utils.getCurrUser(req);
        res.render('index', {
            title: '这里是系统首页',
            user: user
        });
    });

module.exports = router;
