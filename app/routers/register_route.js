var controller = require("../controllers/register_con"),
    multipart = require("connect-multiparty");
var multipartMiddleware = multipart();

module.exports = function (app) {
    app.post("/register", controller.register);
    app.get("/id/check", controller.idChk);
};
