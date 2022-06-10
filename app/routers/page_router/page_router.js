var passport = require('passport');
var path = require('path');

module.exports = function (app) {
    app.get('/sub/about', (req, res) => {
        res.render('./sub/about');
    });

    app.get('/sub/qa', (req, res) => {
        res.render('./sub/qa');
    });

    app.get('/account/register', (req, res) => {
        res.render('./account/register');
    });

    app.get('/account/register_creataccount', (req, res) => {
        res.render('./account/register_creataccount');
    });

    app.get('/account/login', (req, res) => {
        res.render('./account/login');
    });
};
