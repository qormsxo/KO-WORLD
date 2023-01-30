const { equal } = require('assert');
const path = require('path'),
    crud = require('../../model/crud');
const zipper = require('multer-zip').default;
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');

const challenge = {
    // 현재 라운드 가지고오기
    getRound: (gradeCode, func) => {
        let today = new Date(+new Date() + 3240 * 10000).toISOString().replace('T', ' ').replace(/\..*/, '');
        let roundSql = `SELECT ROUND_ORD , QUES_NUM  , ROUND_NM_EN FROM tb_round WHERE GRADE_CODE = ${gradeCode} AND  ROUND_FROM  < '${today}' AND ROUND_TO >= '${today}'`;
        let roundData = {
            query: roundSql,
        };
        crud.sql(roundData, (result) => {
            console.log(result[0]);
            if (result[0] != null) {
                func(true, result[0]);
            } else {
                func(false, 'It is not a challenge period');
            }
        });
    },
    // 챌린지 페이지
    challenge: (req, res) => {
        const user = (func) => {
            let hostQuery = `SELECT IDX , HOST_NM_KR ,HOST_NM_EN, CURR_CON ,MAX_CON FROM tb_host WHERE enable = 1  `;

            let hostSelect = {
                query: hostQuery,
            };
            crud.sql(hostSelect, (hosts) => {
                func(hosts);
            });
        };

        if (req.session.passport) {
            //console.log(req.user);

            const { PERM_CODE, GRADE_CODE, GRADING_RESULT } = req.user;

            if (PERM_CODE == 0000) {
                res.render('./challenge/challenge_server');
                res.end();
            } else {
                if (GRADING_RESULT == 'F') {
                    res.send("<script> alert('You do not have permission to challenge.'); window.location.href = '/'; </script>");
                } else {
                    challenge.getRound(GRADE_CODE, (status, result) => {
                        if (status) {
                            // challenge.round = result['ROUND_ORD'];
                            user((hosts) => {
                                res.render('./challenge/challenge', {
                                    hosts: hosts,
                                    ques: result['QUES_NUM'],
                                    challengeName: result['ROUND_NM_EN'],
                                });
                            });
                        } else {
                            res.send(`<script> alert('${result}'); window.location.href = '/'; </script>`);
                        }
                    });
                }
            }
        } else {
            res.redirect('/');
        }
    },
    // 어드민 페이지 데이터 테이블
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
    // 어드민 유저 접속수 바꾸기
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
    //서버 클릭시 url 이동
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
    // 서버 enable 함수
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
    changeUrl: (req, res) => {
        //console.log(req.body);
        const { idx, url } = req.body;
        let enableSql = `UPDATE tb_host SET HOST_ADDR = ?  WHERE IDX = ? `;
        const enableData = {
            query: enableSql,
            params: [url, idx],
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
    // 정답 제출 함수
    answer: (req, res) => {
        if (!req.session.passport) {
            res.redirect('/');
        }

        const { USER_ID, USER_NM, GRADE_CODE } = req.user;

        const { files } = req;

        console.log(files);
        console.log(files[0] == null);
        console.log(req.body);

        let answer = '';

        for (var key in req.body) {
            req.body[key] = sanitizeHtml(req.body[key], { allowedTags: [] });
            if (req.body[key] == '') continue; // null 이면
            answer += req.body[key] + ' |\\| ';
        }

        answer = answer.slice(0, -5);
        //console.log('???', answer);
        // 답변 insert 하는 함수
        const answerInsert = (round, USER_ID, answer, uploadPath, zipname, func) => {
            const answerSql =
                'INSERT INTO tb_answer ( ROUND_ORD , USER_ID, ANSWER, ANS_FILE_PATH, ANS_FILE_NAME, REG_DTTM)' + ' VALUES(?,?,?,?,?,NOW())';
            const answerReg = {
                query: answerSql,
                params: [round, USER_ID, answer, uploadPath, zipname],
            };

            crud.sql(answerReg, (result) => {
                if (result['affectedRows'] == 1) {
                    func(true);
                } else {
                    func(false);
                }
            });
        };
        // 답변 업데이트
        const answerUpdate = (round, USER_ID, answer, uploadPath, zipname, func) => {
            let params = [];
            if (uploadPath == null && zipname == null) {
                params = [answer, round, USER_ID];
            } else if (answer == '') {
                params = [uploadPath, zipname, round, USER_ID];
            } else {
                params = [answer, uploadPath, zipname, round, USER_ID];
            }
            const answerUpdateSql = `UPDATE tb_answer SET  ${answer == '' ? '' : 'ANSWER = ?,'} ${
                uploadPath == null ? '' : ' ANS_FILE_PATH = ?, ANS_FILE_NAME =?, '
            }  REG_DTTM = NOW() WHERE ROUND_ORD  = ? AND USER_ID = ?`;

            const answerUpdateData = {
                query: answerUpdateSql,
                params: params,
            };
            console.log(answerUpdateData);
            crud.sql(answerUpdateData, (result) => {
                console.log(result);
                if (result['affectedRows'] == 1) {
                    func(true);
                } else {
                    func(false);
                }
            });
        };

        // 답변 히스토리 insert 하는 함수
        const historyInsert = (round, USER_ID, answer, uploadPath, zipname) => {
            const hisSql =
                'INSERT INTO tb_answer_his (ROUND_ORD , USER_ID ,ANSWER ,ANS_FILE_PATH, ANS_FILE_NAME, REG_DTTM)' + ' VALUES(?,?,?,?,?,NOW());';
            const updateUserAnswerSql = 'UPDATE tb_user SET ANSWER = ? WHERE USER_ID = ?;';
            const hisInsertData = {
                query: hisSql + updateUserAnswerSql,
                params: [round, USER_ID, answer, uploadPath, zipname, 1, USER_ID],
            };
            crud.sql(hisInsertData, (result) => {
                if (result[0].affectedRows === 1 && result[1].affectedRows === 1) {
                    // func(true);
                    res.status(200).send({ message: 'Good Luck!' });
                } else {
                    // func(false);
                    res.status(404).send({ message: 'history error' });
                }
            });
        };

        // 업데이트 하는 로직 함수
        const answerUpdateLogic = (round, USER_ID, answer, uploadPath, zipname) => {
            answerUpdate(round, USER_ID, answer, uploadPath, zipname, (updateResult) => {
                if (updateResult) {
                    historyInsert(round, USER_ID, answer, uploadPath, zipname);
                } else {
                    res.status(404).send({ message: 'answer update error' });
                }
            });
        };
        // 새로 제출하는 로직 함수
        const answerInsertLogic = (round, USER_ID, answer, uploadPath, zipname) => {
            answerInsert(round, USER_ID, answer, uploadPath, zipname, (answerResult) => {
                if (answerResult) {
                    historyInsert(round, USER_ID, answer, uploadPath, zipname);
                } else {
                    res.status(404).send({ message: 'answer Insert error' });
                }
            });
        };

        // 답변을 했는지 체크하는 함수
        const isAnswered = (userId, round, func) => {
            const answerCheckSql = 'SELECT USER_ID , ROUND_ORD , ANS_FILE_PATH, ANS_FILE_NAME FROM tb_answer WHERE USER_ID = ? AND ROUND_ORD = ?';

            const checkData = {
                query: answerCheckSql,
                params: [userId, round],
            };
            crud.sql(checkData, (result) => {
                console.log(result);
                if (result[0] == null) {
                    func(false);
                } else {
                    func(true, result);
                }
            });
        };
        // 챌린지 기간인지 확인
        challenge.getRound(GRADE_CODE, (status, result) => {
            if (status) {
                let round = result['ROUND_ORD'];
                // 제출했는지 안했는지 확인
                isAnswered(USER_ID, round, (answered) => {
                    let uploadPath = null;
                    let zipname = null;

                    // 파일업로드 안했을때
                    if (files[0] == null) {
                        if (answered) {
                            // 이미 제출했을때
                            console.log('==================== 정답 수정 , 파일 x ======================');
                            answerUpdateLogic(round, USER_ID, answer, uploadPath, zipname);
                        } else {
                            // 새로 올릴때
                            console.log('==================== 새로 제출 , 파일 x ======================');
                            answerInsertLogic(round, USER_ID, answer, uploadPath, zipname);
                        }
                    } else {
                        // 파일 제출했을때
                        uploadPath = `uploadFiles/${USER_ID}`;

                        const dest = path.join(__dirname, `../../../${uploadPath}`); // zip 파일 담을 경로

                        fs.mkdirSync(dest, { recursive: true });

                        const today = new Date().toISOString().substring(0, 10); // 오늘 날짜 yy-mm-dd

                        zipname = `${round}round_${today}_${USER_NM}.zip`; // zip 파일 이름 라운드 별로 바꿔야댐

                        const filenamer = ({ originalname }) => `${originalname}`; // 파일 이름 짓기

                        //console.log(files, dest, zipname, filenamer);

                        //파일 압축해서 저장
                        zipper({ files, dest, zipname, filenamer })
                            .then(() => {
                                //const params = [round, USER_ID, answer, uploadPath, zipname];
                                console.log('================zip=================');
                                if (answered) {
                                    // 이미 제출했을때
                                    console.log('==================== 수정 , 파일 O ======================');
                                    answerUpdateLogic(round, USER_ID, answer, uploadPath, zipname);
                                } else {
                                    // 새로 올릴때
                                    console.log('==================== 새로 제출 , 파일 O ======================');
                                    answerInsertLogic(round, USER_ID, answer, uploadPath, zipname);
                                }
                            })
                            .catch((error) => {
                                console.log('=================error==============', error);
                                res.status(404).send({ message: error });
                            });
                    }
                });
            } else {
                // 챌린지 기간이 아닐때
                res.send(`<script> alert('${result}'); window.location.href = '/'; </script>`);
            }
        });
    },
};

module.exports = challenge;
