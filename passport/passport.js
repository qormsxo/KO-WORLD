const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
const mariadb = require('mariadb'),
    config = require('config'),
    crud = require('../app/model/crud.js'),
    requestIp = require('request-ip');
const bcrypt = require('bcrypt');
const rounds = 10;

module.exports = () => {
    // var ip_all;
    // var session_id;
    // var session_timeout;
    passport.serializeUser((user, done) => {
        //console.log("passport session", user) //req.session.passport.user에 저장
        done(null, user);
    });
    // 매개변수 id는 req.session.passport.user에 저장된 값
    passport.deserializeUser((user, done) => {
        done(null, user); // 여기의 user가 req.user가 됨
    });

    passport.use(
        new LocalStrategy(
            {
                usernameField: 'id',
                passwordField: 'password',
                session: true, // 세션에 저장 여부
                passReqToCallback: true,
            },
            (req, username, password, done) => {
                var sql = `SELECT * FROM tb_user WHERE user_id = ? AND  ACCEPT ='1'`;
                //console.log(username, password);
                var filter_data = {
                    query: sql,
                    params: [username],
                };
                crud.sql(filter_data, async (docs) => {
                    //console.log('passport', docs[0]);
                    if (docs[0] == undefined) {
                        return done(null, false, { message: 'Please check your ID' });
                    } else {
                        // 비밀번호가 맞으면
                        let isMatch = await bcrypt.compare(password, docs[0].USER_PWD);
                        if (isMatch) {
                            return done(null, docs[0]);
                        } else {
                            // pw 안맞음
                            return done(null, false, {
                                message: 'Please check the password',
                            });
                        }
                    }
                });
            }
        )
    );
};
