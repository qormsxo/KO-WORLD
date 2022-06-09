const logger = require('morgan'),
	path = require('path'),
	body_parser = require('body-parser'),
	cookie_parser = require('cookie-parser'),
	config = require('config'),
	express = require('express'),
	fs = require('fs'),
	passport = require('passport'),
	session = require('express-session'),
	nocache = require('nocache'),
	flash = require('connect-flash'),
	sweetalert = require('sweetalert');
const engines = require('consolidate');
const mustache = require('mustache-express');
const ejs = require('ejs');

const allowedMethods = ['GET', 'HEAD', 'POST', 'DELETE', 'PATCH'];
module.exports = function (app) {
	// app.engine('html', mustache());

	// app.set('view engine', 'html');
	app.set('view engine', 'ejs');
	app.set('views', 'public/views');

	app.use(
		body_parser.urlencoded({
			extended: true,
			limit: '50mb',
		})
	);

	app.use(
		body_parser.json({
			limit: '50mb',
		})
	);

	app.use(logger('dev')); //웹 요청이 들어왔을 때 로그를 출력

	app.use(
		session({
			secret: '@#@$MYSIGN#@$#$',
			resave: true,
			saveUninitialized: true,
			rolling: true,
			cookie: {
				maxAge: 60000 * 15,
			},
		})
	);
	app.use((req, res, next) => {
		if (!allowedMethods.includes(req.method)) return res.send(405, 'Method Not Allowed');
		if (req.session.passport) {
			req.session.passport.user.session_timeout = req.session.cookie.expires;
		}
		if (req.url == '/' || req.url.indexOf('/login') != -1 || req.url.indexOf('/logout') != -1 || req.url.indexOf('/css') != -1 || req.url.indexOf('/img') != -1 || req.url.indexOf('/js') != -1) {
			return next();
		}
		// else {
		//     app.get('/');
		//     return res.send("<script> alert('로그인해 주세요'); window.location.href = '/'; </script>")
		// }
		return next();
	});
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());
	app.use(nocache());
	app.use(express.static(config.get('path.public')));

	// 서버 접속 시 연결 page 관련
	// require(path.join(__dirname, 'app/pages/router.js'))(app);
};
