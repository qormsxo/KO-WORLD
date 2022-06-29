var passport = require('passport');
var path = require('path');
var controller = require('../../controllers/user_controller/user_con');

module.exports = function (app) {
    app.get('/user/user_list', (req, res) => {
        if (req.user === undefined || req.user.PERM_CODE != '0000') {
            return res.send("<script> alert('do not have permission'); window.location.href = '/'; </script>");
        }
        res.render('./user/user_list');
    });

    app.get('/user/committee_list', (req, res) => {
        if (req.user === undefined || req.user.PERM_CODE != '0000') {
            return res.send("<script> alert('do not have permission'); window.location.href = '/'; </script>");
        }
        res.render('./user/committee_list');
    });

    app.get('/user/user_profile', controller.get_user_profile_view);

    app.patch('/user/accept', controller.update_user_accept);

    app.patch('/user/committee/grade_code', controller.update_committee_grade);

    app.get('/user/password_check', controller.user_password_check);

    app.get('/modal', (req, res) => {
        res.render('./user/modal');
    });

    app.patch('/user/password_modify', controller.update_user_password);

    app.post('/user/normal_admin', controller.post_normal_admin);
    app.get('/user/answer', controller.user_answer);

    app.patch('/user/info_modify', controller.update_user_info);
};
