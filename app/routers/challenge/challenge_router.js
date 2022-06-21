const controller = require('../../controllers/challenge/challenge_con');
const multer = require('multer');
const fs = require('fs');
const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const path = `uploadFiles/${req.user.USER_ID}`;
//         fs.mkdirSync(path, { recursive: true });
//         cb(null, path);
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '_' + file.originalname);
//     },
// });
const upload = multer({ storage: storage });

module.exports = function (app) {
    app.get('/challenge', controller.challenge);
    app.post('/challenge/server', controller.serverClick);
    app.put('/challenge/server/curr-con', controller.curConSet);
    app.post('/challenge/answer', upload.array('answerFile'), controller.answer);
};
