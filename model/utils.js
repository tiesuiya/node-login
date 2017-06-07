module.exports = {
    getToken: function (req) {
        return req.signedCookies.REQ_TOKEN == undefined ? "" : req.signedCookies.REQ_TOKEN;
    },
    getCurrUser: function (req) {
        /**
         * { exp: 1495791872,
             user_name: 'myname',
             jti: 'bef81464-04dd-4f55-ba12-0cbc377e26aa',
             client_id: 'web-app',
             scope: [ 'app' ] }
         */
        var currentUser;
        var access_token = this.getToken(req);
        if (access_token.length > 0) {
            currentUser = JSON.parse(new Buffer(access_token.split('.')[1], 'base64').toString());
        }
        return currentUser;
    }

};