var controller = require('../../controllers/challenge/challenge_con'),
    multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (app) {
    app.get('/challenge', controller.challenge);
    app.post('/challenge/server', controller.serverClick);
    app.put('/challenge/server/max-con', controller.maxConSet);
};
