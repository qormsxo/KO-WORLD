const { equal } = require('assert');
const path = require('path'),
    crud = require('../../model/crud');
const zipper = require('multer-zip').default;
const fs = require('fs');

const challenge = {
    challenge: (req, res) => {
        if (req.session.passport) {
            //console.log(req.user);

            const { PERM_CODE, GRADE_CODE } = req.user;

            if (PERM_CODE == 0000) {
                res.render('./challenge/challenge_server');
                res.end();
            } else {
                user((ques, hosts) => {
                    if (ques[0] != undefined) {
                        res.render('./challenge/first_challenge', { hosts: hosts, ques: ques[0].ques_num });
                    } else {
                        res.send(404);
                    }
                });
            }
        } else {
            res.redirect('/');
        }
    },
    administrator: (req, res) => {
        let offset = req.query.start; //db 검색 시작
        let limit = req.query.length; //페이지에 띄울 row 갯수
        let order_cols = req.query.columns[req.query.order[0].column].data.trim(); //정렬
        let order_asc = req.query.order[0].dir.trim();

        let table = {};
        let params = {};

        // let { type, search_keyword, search_option } = req.query;

        //console.log(type == 'high' ? '0000' : '0001');

        table['draw'] = req.query.draw;

        params['offset'] = offset; //start 지점
        params['limit'] = limit; //출력 개수
        params['order_cols'] = order_cols;
        params['order_asc'] = order_asc;

        //console.log('params: ', params);

        let where_condition = '  ';

        const { PERM_CODE, GRADE_CODE } = req.user;

        //테이블 count
        let table_name = ' tb_host ';
        let column_select = ' IDX , HOST_ADDR , HOST_NM_KR , HOST_NM_EN , CURR_CON , MAX_CON , ENABLE ';
        let query_conditon = 'SELECT count(*) FROM ' + table_name + where_condition;
        let filter_count = {
            query: query_conditon,
            params: [],
        };
        crud.sql(filter_count, function (calldata) {
            //console.log("calldata: ", calldata)

            table.recordsTotal = calldata[0]['count(*)'];
            table.recordsFiltered = calldata[0]['count(*)'];
            //console.log("table 1 ", table)

            //===================================
            //step 2 데이터 조회
            // 조건 생성
            let sql =
                'SELECT ' +
                column_select +
                ' FROM ' +
                table_name +
                where_condition +
                ' ORDER BY  ' +
                params.order_cols +
                ' ' +
                params.order_asc +
                ' LIMIT ' +
                params.limit +
                ' OFFSET ' +
                params.offset;

            let filter_data = {
                query: sql,
                params: [],
            };

            console.log(filter_data);

            crud.sql(filter_data, (docs) => {
                table.data = docs; //검색 데이터 넣기

                //console.log('docs: ', docs);
                //console.log('table : ', table);
                res.send(table);
            });
        });
    },
    curConSet: (req, res) => {
        let { PERM_CODE } = req.user;
        if (PERM_CODE != 0000) {
            res.status(404).send({ message: 'not admin' });
        }
        const { idx, val } = req.body;
        console.log(idx, val);

        let state;

        if (val == '+') {
            state = 'if( curr_con >= max_con, curr_con , curr_con+1)';
        } else if (val == '-') {
            state = 'if( curr_con <= 0, curr_con , curr_con-1)';
        } else {
            res.status(404).send({ message: 'val 이 없음' });
        }

        const sql = `UPDATE tb_host SET curr_con =  ${state} WHERE idx = ?`;

        const updateCurr = {
            query: sql,
            params: [idx],
        };
        console.log(updateCurr);
        crud.sql(updateCurr, (result) => {
            console.log(result);
            if (result['affectedRows'] == 1) {
                res.status(200).send({ success: true });
            } else {
                res.status(404).send({ message: 'error' });
            }
        });
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
    enable: (req, res) => {
        //console.log(req.body);
        const { idx, status } = req.body;
        let enableSql = `UPDATE tb_host SET ENABLE = ${status == 'true' ? '1' : '0'}  WHERE IDX = ? `;
        const enableData = {
            query: enableSql,
            params: [idx],
        };
        ///console.log(enableData);
        crud.sql(enableData, (result) => {
            console.log(result);
            if (result['affectedRows'] == 1) {
                res.status(200).send({ success: true });
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
            answer += req.body[key] + ' |\\| ';
        }

        answer = answer.slice(0, -6);
        // console.log(answer);

        const uploadPath = `uploadFiles/${USER_ID}`;

        const dest = path.join(__dirname, `../../../${uploadPath}`); // zip 파일 담을 경로

        fs.mkdirSync(dest, { recursive: true });

        const today = new Date().toISOString().substring(0, 10); // 오늘 날짜 yy-mm-dd

        const zipname = `${Math.ceil(Math.random() * 10)}_${today}_${USER_NM}.zip`; // zip 파일 이름

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
                // 답변 insert
                crud.sql(answerReg, (result) => {
                    if (result['affectedRows'] == 1) {
                        const userUpdate = `UPDATE tb_user SET answer = '1' WHERE user_id = ?`;

                        const update = {
                            query: userUpdate,
                            params: [USER_ID],
                        };

                        crud.sql(update, (result) => {
                            if (result['affectedRows'] == 1) {
                                req.user.ANSWER = '1';
                                res.status(200).send({ message: 'Good Luck!' });
                            } else {
                                res.status(404).send({ message: 'User Update Error' });
                            }
                        });
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

const user = (func) => {
    let hostQuery = `SELECT IDX , HOST_NM_KR ,HOST_NM_EN, CURR_CON ,MAX_CON FROM tb_host  `;

    let hostSelect = {
        query: hostQuery,
    };
    crud.sql(hostSelect, (hosts) => {
        let quesQuery = 'SELECT ques_num FROM tb_grade WHERE perm_code = ? AND grade_code = ?';
        let params = [PERM_CODE, GRADE_CODE];

        let quesSelect = {
            query: quesQuery,
            params: params,
        };

        crud.sql(quesSelect, (ques) => {
            //console.log(ques);
            func(ques, hosts);
        });
    });
};

// exports.challenge = challenge;

module.exports = challenge;
