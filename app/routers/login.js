var passport = require("passport");
var fs = require("fs");
var path = require("path");
// const login = require("../controllers/login");

module.exports = function (app) {
  app.get("/login", (req, res) => {
    res.render("login");
  });
  // 로그인(post)
  app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/", // 성공시 가는 url
      failureRedirect: "/login", // 실패시 url
      failureFlash: true,
    })
  );

  //app.get("/logout", login.logout);

  // app.get('/is/user/pw/chage', login.user_pw_change)
};
