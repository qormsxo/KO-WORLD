var fs = require('fs');
var path = require('path');
const login = require('../../controllers/account_controller/login.con');

module.exports = function (app) {
    app.get('/account/login', (req, res) => {
        let errorMsg = req.flash('message');
        if (errorMsg) {
            res.render('./account/login', { errorMsg: errorMsg });
        } else {
            res.render('./account/login');
        }
    });
    // 로그인(post)
    app.post('/login', login.login);

    app.get('/logout', login.logout);

    // app.get('/is/user/pw/chage', login.user_pw_change)
};
