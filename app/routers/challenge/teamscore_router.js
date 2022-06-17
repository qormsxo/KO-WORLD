const controller = require('../../controllers/challenge/teamscore_con');
const multer = require('multer');
const fs = require('fs');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = function (app) {
    app.get('/teamscore', controller.teamscore);
    // app.post('/challenge/server', controller.serverClick);
    // app.put('/challenge/server/max-con', controller.maxConSet);
    // app.post('/challenge/answer', upload.array('answerFile'), controller.answer);
};
