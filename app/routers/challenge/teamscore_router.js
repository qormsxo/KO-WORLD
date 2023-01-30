const controller = require('../../controllers/challenge/teamscore_con');
const fs = require('fs');

module.exports = function (app) {
    app.get('/teamscore', controller.page);
    app.get('/teamscore/checkRound', controller.checkRound);
    app.get('/answer', controller.score);
    app.get('/answer/file', controller.fileDownload);
    app.get('/answer/user', controller.getAnswer);
    app.post('/answer/score', controller.scoring);
    app.patch('/answer/grading_result', controller.grading_result);
};
