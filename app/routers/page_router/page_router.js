var passport = require('passport');
var path = require('path');

module.exports = function (app) {
	app.get('/sub/about', (req, res) => {
		var main_path = path.join(__dirname + '/../../../public/views/sub/about.ejs');

        res.render(main_path);
	});

    app.get('/sub/qa', (req, res) => {
		var main_path = path.join(__dirname + '/../../../public/views/sub/qa.ejs');

        res.render(main_path);
	});

    app.get('/account/register', (req, res) => {
		var main_path = path.join(__dirname + '/../../../public/views/account/register.ejs');

        res.render(main_path);
	});

    app.get('/account/register_creataccount', (req, res) => {
		var main_path = path.join(__dirname + '/../../../public/views/account/register_creataccount.ejs');

        res.render(main_path);
	});

    app.get('/account/login', (req, res) => {
		var main_path = path.join(__dirname + '/../../../public/views/account/login.ejs');

        res.render(main_path);
	});
};
