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
    app.get('/challenge/administrator', controller.administrator);
    app.post('/challenge/server', controller.serverClick); // 유저가 서버 클릭했을때
    app.put('/challenge/server/curr-con', controller.curConSet); // curr_con 증감 함수
    app.put('/challenge/server/enable', controller.enable); //
    app.put('/challenge/server/url', controller.changeUrl);
    app.post('/challenge/answer', upload.array('answerFile'), controller.answer);
};
