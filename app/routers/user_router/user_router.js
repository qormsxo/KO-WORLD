var passport = require('passport');
var path = require('path');
var controller = require('../../controllers/user_controller/user_con');

module.exports = function (app) {
    app.get('/user/user_list', (req, res) => {
        res.render('./user/user_list');
    });
};
