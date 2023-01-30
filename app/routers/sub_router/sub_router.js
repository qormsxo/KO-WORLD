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
        if (req.user === undefined) {
            return res.send("<script> alert('do not have permission to answer'); window.location.href = '/sub/qa'; </script>");
        } else {
            return res.render('./sub/qa_write');
        }
    });

    app.post('/sub/qa/write', controller.post_qa_view);

    app.get('/sub/qa/answer', controller.get_qa_answer_view);

    app.get('/sub/qa/answer/modify', controller.get_qa_answer_modify_view);

    app.post('/sub/qa/answer/modify', controller.update_qa_answer);

    app.post('/sub/qa/answer', controller.post_qa_answer);

    app.patch('/sub/qa/views', controller.update_qa_views);

    app.delete('/sub/qa/:id', controller.delete_qa);
};
