var controller = require('../../controllers/ApiControl'),
    multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
module.exports = function (app) {
    app.get('/api/qa_list', controller.get_qa_table_list);

    app.get('/api/user_list', controller.get_user_table_list);
};
