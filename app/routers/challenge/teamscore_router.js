const controller = require('../../controllers/challenge/teamscore_con');
const fs = require('fs');

module.exports = function (app) {
    app.get('/teamscore', controller.page);
    app.get('/answer', controller.score);
    app.get('/answer/file', controller.fileDownload);
};
