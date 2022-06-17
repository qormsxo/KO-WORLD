const { equal } = require('assert');
const path = require('path'),
    crud = require('../../model/crud');
const zipper = require('multer-zip').default;
const fs = require('fs');

module.exports = {
    teamscore: (req, res) => {
        res.render('./challenge/teamscore');
    },
    serverClick: (req, res) => {
        //console.log(req.body);

        let { idx } = req.body;

        let selectQuery = 'SELECT CURR_CON  , MAX_CON  , HOST_ADDR  FROM tb_host WHERE idx = ? ';

        let hostSelect = {
            query: selectQuery,
            params: [idx],
        };

        crud.sql(hostSelect, (host) => {
            //console.log(host);
            if (host[0].MAX_CON <= host[0].CURR_CON) {
                res.json({
                    possibility: false,
                    message: '정원초과',
                });
            } else {
                let increaseQuery = 'UPDATE tb_host SET curr_con = curr_con + 1 WHERE idx = ?';

                let increaseData = {
                    query: increaseQuery,
                    params: [idx],
                };
                crud.sql(increaseData, (result) => {
                    console.log(result);
                    if (result['affectedRows'] == 1) {
                        console.log('연결');
                        res.json({
                            possibility: true,
                            address: host[0].HOST_ADDR,
                        });
                    } else {
                        res.status(404);
                    }
                });
            }
        });
    },
    maxConSet: (req, res) => {
        let { PERM_CODE } = req.user;
        if (PERM_CODE != 0000) {
            res.status(404).send({ message: 'not admin' });
        }
        const { idx, val } = req.body;
        //console.log(idx, val);

        let state;

        if (val == '+') {
            state = 'max_con+1';
        } else if (val == '-') {
            state = 'if(curr_con >= max_con , max_con , max_con-1)';
        } else {
            res.status(404).send({ message: 'val 이 없음' });
        }

        const sql = `UPDATE tb_host SET max_con =  ${state} WHERE idx = ?`;

        const updateMax = {
            query: sql,
            params: [idx],
        };

        crud.sql(updateMax, (result) => {
            //console.log(result);
            if (result['affectedRows'] == 1) {
                res.status(200);
            } else {
                res.status(404).send({ message: 'error' });
            }
        });
    },
    answer: (req, res) => {
        const { USER_ID, USER_NM } = req.user;

        if (!USER_ID) {
            res.redirect('/');
        }

        const { files } = req;

        // console.log(files);
        // console.log(req.body);

        let answer = [];

        for (var key in req.body) {
            answer += req.body[key] + ' |\\|';
        }

        answer = answer.slice(0, -4);
        // console.log(answer);

        const uploadPath = `uploadFiles/${USER_ID}`;

        const dest = path.join(__dirname, `../../../${uploadPath}`); // zip 파일 담을 경로

        fs.mkdirSync(dest, { recursive: true });

        const today = new Date().toISOString().substring(0, 10); // 오늘 날짜 yy-mm-dd

        const zipname = `${Math.random() * 10}_${today}_${USER_NM}.zip`; // zip 파일 이름

        const filenamer = ({ originalname }) => `${today}_${originalname}`; // 파일 이름 짓기

        //console.log(files, dest, zipname, filenamer);

        zipper({ files, dest, zipname, filenamer })
            .then(() => {
                console.log('================zip=================');

                const answerSql = 'INSERT INTO tb_answer (USER_ID, ANSWER, ANS_FILE_PATH, ANS_FILE_NAME, REG_DTTM)' + ' VALUES(?,?,?,?,NOW())';
                const params = [USER_ID, answer, uploadPath, zipname];

                const answerReg = {
                    query: answerSql,
                    params: params,
                };

                crud.sql(answerReg, (result) => {
                    if (result['affectedRows'] == 1) {
                        res.status(200).send({ message: 'Good Luck!' });
                    } else {
                        res.status(404).send({ message: 'error' });
                    }
                });
            })
            .catch((error) => {
                console.log('=================error==============', error);
                res.status(404).send({ message: error });
            });
    },
};
