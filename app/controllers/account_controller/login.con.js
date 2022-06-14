const path = require('path'),
    crud = require('../../model/crud');
const { stringify } = require('querystring');
const bcrypt = require('bcrypt');
const rounds = 10;
const passport = require('passport');

module.exports = {
    login: (req, res, next) => {
        passport.authenticate(
            'local',
            {
                successRedirect: '/', // 성공시 가는 url
                failureRedirect: '/account/login', // 실패시 url
                failureFlash: true,
            },
            (authError, user, info) => {
                if (authError) {
                    console.log(authError);
                    return next(authError);
                }
                if (!user) {
                    res.locals.isLogin = false;
                    //console.log('!user', info);
                    // 에러 문구
                    req.flash('message', info.message);
                    return res.redirect(`/account/login`);
                }

                return req.login(user, (loginError) => {
                    if (loginError) {
                        console.error('loginError: ', loginError);
                        return next(loginError);
                    }
                    // console.log(user);

                    return res.redirect('/');
                });
            }
        )(req, res, next);
    },
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log(req.user);
                res.redirect('/');
            }
        });
    },
};
