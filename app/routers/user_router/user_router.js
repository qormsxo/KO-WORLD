var passport = require('passport');
var path = require('path');
var controller = require('../../controllers/user_controller/user_con');

module.exports = function (app) {
    app.get('/user/user_list', (req, res) => {
        if (req.user === undefined || req.user.PERM_CODE != '0000' || req.user.GRADE_CODE != '0000') {
            return res.send("<script> alert('do not have permission'); window.location.href = '/sub/qa'; </script>");
        }
        res.render('./user/user_list');
    });

    app.get('/user/user_profile', (req, res) => {
        // if (req.user === undefined) {
        // return res.send("<script> alert('do not have permission'); window.location.href = '/'; </script>");
        // }
        res.render('./user/user_profile');
    });

    app.patch('/user/accept', controller.update_user_accept);
};
