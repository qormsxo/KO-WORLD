var passport = require('passport');
var fs = require('fs');
var path = require('path');
var login = require('../controllers/login');

module.exports = function (app) {
	app.get('/login', (req, res) => {
		var main_path = path.join(__dirname + '/../../public/views/login.html');

		fs.readFile(main_path, 'UTF-8', function (error, data) {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(data);
		});
	});
	// 로그인(post)
	app.post(
		'/login',
		passport.authenticate('local', {
			successRedirect: '/', // 성공시 가는 url
			failureRedirect: '/', // 실패시 url
			failureFlash: true,
		})
	);

	app.get('/logout', login.logout);

	// app.get('/is/user/pw/chage', login.user_pw_change)
};
