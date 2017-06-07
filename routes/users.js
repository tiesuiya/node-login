var express = require('express');
var superAgent = require('superagent');
var utils = require('../model/utils');
var router = express.Router();

router.get('/u/:userName', function (req, res, next) {
        var token = utils.getToken(req);
        superAgent.get('http://gateway:10000/account/accounts/current')
            .set('Authorization', 'Bearer ' + token)
            .end(function (err, res1) {
                if (err) {
                    next(err);
                } else {
                    return res.send(res1.body);
            }
        });
});

module.exports = router;
