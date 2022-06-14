var controller = require('../controllers/challenge_con'),
    multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

module.exports = function (app) {
    app.get('/challenge', (req, res) => {
        res.render('./first_challenage');
    });
};
