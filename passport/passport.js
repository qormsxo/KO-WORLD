const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
const mariadb = require('mariadb'),
    config = require('config'),
    crud = require('../app/model/crud.js'),
    requestIp = require('request-ip');
const bcrypt = require('bcryptjs');

module.exports = () => {
    // var ip_all;
    // var session_id;
    // var session_timeout;
    passport.serializeUser((user, done) => {
        //console.log("passport session", user) //req.session.passport.user에 저장
        done(null, user[0]);
    });
    passport.deserializeUser((user, done) => { // 매개변수 id는 req.session.passport.user에 저장된 값
        done(null, user) // 여기의 user가 req.user가 됨
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        session: true, // 세션에 저장 여부
        passReqToCallback: true,
    }, (req, username, password, done) => {
        
        var sql = "select * from admin_tb where id = ? ";
        
        var filter_data = {
            query: sql,
            params: [username]
        }
        crud.select(filter_data, (docs) => {
            if(docs[0] == undefined) {
                return done(null, false, {message: '아이디를 다시 확인해주세요' });
            } else {
                if (bcrypt.compareSync(password, docs[0].password)) {
                    return done(null, [username, docs[0].password])
                } else {
                    return done(null, false, {message: '비밀번호를 잘못 입력하셨습니다.' });
                }
            }
        })

    }));

}
