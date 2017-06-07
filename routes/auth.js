/**认证控制*/
var express = require('express');
var superAgent = require('superagent');
var router = express.Router();

router.route('/register')
    .get(function (req, res) {
        return res.render('register', {errorMsg: ''});
    })
    .post(function (req, res, next) {
        var errorMsg;
        // check repassword
        var username = req.body.username;
        var password = req.body.password;
        var repassword = req.body.repassword;
        if (password != repassword) {
            errorMsg = '确认密码有误';
            return res.render('register', {
                errorMsg: errorMsg
            });
        }
        superAgent.post('http://gateway:10000/uaa/users')
            .send({
                username: username,
                password: password
            })
            .end(function (err, res1) {
                if (err) {
                    console.log('ERROR CODE:' + err);
                    switch (err.status) {
                        default:
                            errorMsg = '注册失败！';
                    }
                    return res.render('register', {
                        errorMsg: errorMsg
                    });
                } else {
                    // 登录跳转
                    req.body.username = username;
                    req.body.password = password;
                    loginPost(req, res);
                }
            });
    });

router.route('/login')
    .get(function (req, res) {
        return res.render('login', {errorMsg: ''});
    })
    .post(function (req, res, next) {
        loginPost(req, res);
    });

router.route('/logout')
    .post(function (req, res, next) {
        res.clearCookie('REQ_TOKEN');
        return res.redirect('/');
    });

var loginPost = function(req, res) {
    superAgent.post('http://web-app:secret@gateway:10000/uaa/oauth/token')
        .send({
            grant_type: "password",
            username: req.body.username,
            password: req.body.password
        })
        .set('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')
        .end(function (err, res1) {
            if (err) {
                var errorMsg;
                console.log('ERROR CODE:' + err.status);
                switch (err.status) {
                    case 400:
                        errorMsg = '用户名或密码错误！';
                        break;
                    default:
                        errorMsg = '登录失败！';
                }
                res.render('login', {
                    errorMsg: errorMsg
                });
            } else {
                var token = res1.body.access_token;
                // 设置用户token
                res.cookie('REQ_TOKEN', token, {
                    path: '/',//访问哪一个路径的时候我们给你加上cookie
                    maxAge: 60 * 60 * 1000,//cookie的存活时间,单位毫秒
                    signed: true//是否加签名
                });
                res.redirect('/');
            }
        });
};

module.exports = router;