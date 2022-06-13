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
        done(null, user[0]);
    });
    // 매개변수 id는 req.session.passport.user에 저장된 값
    passport.deserializeUser((user, done) => {
        done(null, user); // 여기의 user가 req.user가 됨
    });

    passport.use(
        new LocalStrategy(
            {
                usernameField: 'username',
                passwordField: 'password',
                session: true, // 세션에 저장 여부
                passReqToCallback: true,
            },
            (req, username, password, done) => {
                var sql = 'SELECT * FROM tb_user WHERE user_id = ? AND  ACCEPT ="0"';

                var filter_data = {
                    query: sql,
                    params: [username],
                };
                crud.sql(filter_data, (docs) => {
                    //console.log(docs[0]);
                    if (docs[0] == undefined) {
                        return done(null, false, { message: '아이디를 다시 확인해주세요' });
                    } else {
                        const encryptedPW = bcrypt.hashSync(password, 10);
                        console.log(encryptedPW, docs[0].USER_PWD);
                        // 비밀번호가 맞으면
                        if (bcrypt.compare(encryptedPW, docs[0].USER_PWD)) {
                            return done(null, [username, docs[0].USER_PWD]);
                        } else {
                            // pw 안맞음
                            return done(null, false, {
                                message: '비밀번호를 잘못 입력하셨습니다.',
                            });
                        }
                    }
                });
            }
        )
    );
};
