var utils = require('../model/utils');

/**认证拦截*/
module.exports = function (req, res, next) {
    var userInfo = utils.getCurrUser(req);
    // token&token是否过期
    var isLogined = userInfo && parseInt(Date.now() / 1000) - userInfo.exp < 0;
    // 判断用户是否登录
    if (isLogined) {
        if (req.url === '/login') {
            return res.redirect('/');
        }
        next();
    } else {
        // 拦截白名单
        var whites = [
            "/",
            "/index",
            "/jinlei",
            "/login",
            "/logout",
            "/register"
        ];
        // 是否拦截
        var isIntercept = true;
        whites.forEach(function (item, index) {
            if (item === req.url) {
                isIntercept = false;
                return false;
            }
        });

        if (isIntercept) {
            // 当前请求被拦截
            // 检查token是否存在和是否过期
            if (isLogined) {
                next();
            } else {
                return res.redirect('/login');
            }
        } else {
            // 当前请求为白名单
            next();
        }
    }
};