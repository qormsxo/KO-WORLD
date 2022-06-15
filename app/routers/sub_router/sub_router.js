var passport = require('passport');
var path = require('path');
var controller = require('../../controllers/sub_controller/sub_con');

module.exports = function (app) {
    app.get('/sub/about', (req, res) => {
        res.render('./sub/about');
    });

    app.get('/sub/qa', (req, res) => {
        res.render('./sub/qa');
    });

    app.get('/sub/qa/view', controller.get_qa_view);

    app.get('/sub/qa/write', (req, res) => {
        res.render('./sub/qa_write');
    });

    app.post('/sub/qa/write', controller.post_qa_view);

    app.get('/sub/qa/answer', controller.get_qa_answer_view);

    app.post('/sub/qa/answer', controller.post_qa_answer);
};
