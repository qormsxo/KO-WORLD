var controller = require('../../controllers/account_controller/register_con'),
    multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (app) {
    app.get('/account/register', (req, res) => {
        res.render('./account/register');
    });

    app.get('/account/register_creataccount', (req, res) => {
        res.render('./account/register_creataccount');
    });

    app.post('/register', controller.register);
    // app.get('/id/check', controller.idChk);
};
