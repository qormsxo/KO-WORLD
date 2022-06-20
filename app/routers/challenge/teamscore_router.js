const controller = require('../../controllers/challenge/teamscore_con');
const fs = require('fs');

module.exports = function (app) {
    app.get('/teamscore', controller.page);
    app.get('/answer', controller.score);
    // app.post('/challenge/server', controller.serverClick);
    // app.put('/challenge/server/max-con', controller.maxConSet);
    // app.post('/challenge/answer', upload.array('answerFile'), controller.answer);
};
