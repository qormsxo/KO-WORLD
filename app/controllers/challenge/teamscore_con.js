const { equal } = require('assert');
const path = require('path'),
    crud = require('../../model/crud');
const zipper = require('multer-zip').default;
const fs = require('fs');
const c = require('config');

module.exports = {
    page: (req, res) => {
        //const { PERM_CODE } = req.user;
        if (req.session.passport) {
            if (req.user.PERM_CODE == 0002) {
                res.redirect('/');
            }
            res.render('./challenge/teamscore');
            //res.render('./challenge/test', { layout: false });
        } else {
            res.redirect('/');
        }

        // const sql =
        //     'SELECT tu.USER_ID,, tu.USER_NM ,tu.BIRTHDAY ,tu.NATIONALITY , tu.EMAIL ,ta.ANS_FILE_PATH, ta. ANS_SCORE , ' +
        //     'DENSE_RANK() OVER(ORDER BY ta.ANS_SCORE  DESC ) AS ranking ' +
        //     'FROM tb_answer ta  INNER JOIN tb_user tu ON ta.USER_ID = tu.USER_ID '+
        //     `WHERE  tu.ACCEPT = '1' AND tu.GRADE_CODE  = ?  ORDER BY ANS_SCORE DESC, IDX `;
    },
    score: (req, res) => {
        //console.log('get_assets_table_list --------', req);

        //console.log('get_assets_table_list --------', req.query);
        let offset = req.query.start; //db 검색 시작
        let limit = req.query.length; //페이지에 띄울 row 갯수
        let order_cols = req.query.columns[req.query.order[0].column].data.trim(); //정렬
        let order_asc = req.query.order[0].dir.trim();

        let table = {};
        let params = {};

        let { type, search_keyword, search_option, select_round_option } = req.query;

        console.log(search_keyword, search_option);

        select_round_option = select_round_option == undefined ? 1 : select_round_option;

        //console.log(type == 'high' ? '0000' : '0001');

        table['draw'] = req.query.draw;

        params['offset'] = offset; //start 지점
        params['limit'] = limit; //출력 개수
        params['order_cols'] = order_cols;
        params['order_asc'] = order_asc;

        //console.log('params: ', params);

        let where_condition = " WHERE tu.ACCEPT = '1' AND tu.GRADE_CODE  = ? ";

        if (select_round_option != undefined) {
            where_condition += ` AND ta.ROUND_ORD = ${select_round_option} `;
        } else {
            where_condition += ` AND ta.ROUND_ORD = 1 `;
        }

        if (search_option != undefined) {
            console.log(search_option);
            if (search_option == 'all') {
                where_condition += ``;
            } else if (search_option == 'required') {
                where_condition += ` AND ta.ANS_SCORE IS NULL `;
            } else if (search_option == 'graded') {
                where_condition += ` AND ta.ANS_SCORE IS NOT NULL `;
            }
        }

        if (search_keyword != undefined && search_keyword != '') {
            where_condition += ` AND ta.USER_ID LIKE '%${search_keyword}%'`;
        }

        //
        const { PERM_CODE, GRADE_CODE } = req.user;
        let isJug;
        if (PERM_CODE == '0001' && GRADE_CODE == '0000') {
            isJug = 0;
        } else if (PERM_CODE == '0000' || (PERM_CODE == '0001' && GRADE_CODE == '0001')) {
            isJug = 1;
        }

        //테이블 count
        let table_name =
            ` (select ROUND_ORD, 1 AS judge_divi from tb_round where ROUND_ORD = ${select_round_option} and now() >= JUDGMENT_FROM and now() < JUDGMENT_TO limit 1) A ` +
            ' right join tb_answer ta on A.ROUND_ORD = ta.ROUND_ORD INNER JOIN tb_user tu ON ta.USER_ID = tu.USER_ID ';
        let column_select =
            " ta.ROUND_ORD as ROUND_ORD, ta.IDX as IDX, tu.USER_ID, tu.USER_NM ,date_format(tu.BIRTHDAY , '%Y-%m-%d') as BIRTHDAY,tu.NATIONALITY , ta.GRADING_RESULT as GRADING_RESULT, tu.EMAIL ," +
            ` if(${isJug} = 1 , ta.ANS_SCORE ,IF( isnull(ta.ANS_SCORE)  , 'Grading required' , concat('<b>', ta.ANS_SCORE , '<b>' )))  as ANS_SCORE , ${isJug} as isJug , ` +
            `DENSE_RANK() OVER(ORDER BY ta.ANS_SCORE  DESC ) AS ranking, A.judge_divi, IF(isnull(ta.ANSWER), 0, ta.ANSWER) AS ANSWER, ` +
            `IF(isnull(ta.ANS_FILE_PATH), 0, ta.ANS_FILE_PATH) as ANS_FILE `;
        let query_conditon = 'SELECT count(*) FROM ' + table_name + where_condition;
        let filter_count = {
            query: query_conditon,
            params: [type == 'high' ? '0000' : '0001'],
        };
        crud.sql(filter_count, function (calldata) {
            //console.log("calldata: ", calldata)

            table.recordsTotal = calldata[0]['count(*)'];
            table.recordsFiltered = calldata[0]['count(*)'];
            //console.log("table 1 ", table)

            //===================================
            //step 2 데이터 조회
            // 조건 생성
            var sql =
                'select ' +
                column_select +
                ' from ' +
                table_name +
                where_condition +
                ' order by  ' +
                params.order_cols +
                ' ' +
                params.order_asc +
                ' limit ' +
                params.limit +
                ' offset ' +
                params.offset;

            var filter_data = {
                query: sql,
                params: [type == 'high' ? '0000' : '0001'],
            };

            console.log(sql);
            console.log(filter_data);

            crud.sql(filter_data, (docs) => {
                table.data = docs; //검색 데이터 넣기
                //
                //console.log('docs: ', docs);
                console.log('table : ', table);
                res.send(table);
            });
        });
    },
    fileDownload: (req, res) => {
        const { IDX } = req.query;
        const sql = 'SELECT ANS_FILE_PATH , ANS_FILE_NAME FROM tb_answer WHERE IDX = ?';

        const data = {
            query: sql,
            params: [IDX],
        };

        crud.sql(data, (result) => {
            console.log(result);
            if (result[0] != undefined) {
                let filePath = result[0].ANS_FILE_PATH + '/' + result[0].ANS_FILE_NAME;
                let fileName = result[0].ANS_FILE_NAME;
                let mimetype = 'application/json';
                res.setHeader('Content-disposition', 'attachment; filename=' + encodeURIComponent(fileName));
                res.setHeader('Content-type', mimetype);
                let filestream = fs.createReadStream(filePath);
                filestream.pipe(res);
            } else {
                res.status(404);
            }
        });
    },
    scoring: (req, res) => {
        // const { user, score } = req.body;
        const { score, IDX, ROUND } = req.body;
        const GRADING_USERID = req.user.USER_ID;
        const PERM_CODE = req.user.PERM_CODE;
        const GRADE_CODE = req.user.GRADE_CODE;

        const round_check_sql = 'select * from tb_round where ROUND_ORD = ? and now() >= JUDGMENT_FROM and now() < JUDGMENT_TO ';
        const round_check_data = {
            query: round_check_sql,
            params: [ROUND],
        };

        crud.sql(round_check_data, (result) => {
            //심사 기간일 경우 업데이트 가능
            if (result[0]) {
                const select_sql = 'select ANS_SCORE from tb_answer where IDX = ?';
                const select_data = {
                    query: select_sql,
                    params: [IDX],
                };

                crud.sql(select_data, (result) => {
                    //채점이 되었을 시 어드민만 점수 수정가능
                    if (result[0].ANS_SCORE != null) {
                        //어드민이 아닌데 update요청시 false 반환
                        if (PERM_CODE !== '0000') return res.send({ status: false, message: 'Only admins can edit scoring' });
                    }
                    //채점이 안되어있을 시 심사위원만 점수 기입가능
                    else {
                        //심사위원 아닌데 update요청시 false 반환
                        if (PERM_CODE !== '0001' && GRADE_CODE !== '0001') return res.send({ status: false, message: 'Only judges can enter scores' });
                    }
                    const sql = 'UPDATE tb_answer SET ANS_SCORE = ?, GRADING_ID = ? WHERE IDX = ?';
                    const data = {
                        query: sql,
                        params: [score, GRADING_USERID, IDX],
                    };
                    crud.sql(data, (result) => {
                        if (result['affectedRows'] == 1) {
                            res.send({ status: true });
                        } else {
                            res.send({ status: false });
                        }
                    });
                });
            } else {
                res.send({ status: false, message: 'It is not the judging period for that round.' });
            }
        });
    },
    getAnswer: (req, res) => {
        let { IDX } = req.query;

        const sql = 'SELECT ANSWER FROM tb_answer WHERE IDX = ?';

        const data = {
            query: sql,
            params: [IDX],
        };

        crud.sql(data, (result) => {
            console.log(result);
            if (result[0] == null) {
                res.status(200).send({ message: 'answer is null' });
            } else {
                let array = result[0]['ANSWER'].split(' |\\| ');
                console.log(array);
                res.send(array);
            }
        });
    },
    grading_result: (req, res) => {
        let { passdivi, IDX, ROUND, USER_ID } = req.body;

        const USERID = req.user.USER_ID;

        const round_check_sql = 'select * from tb_round where ROUND_ORD = ? and now() >= JUDGMENT_FROM and now() < JUDGMENT_TO ';
        const round_check_data = {
            query: round_check_sql,
            params: [ROUND],
        };

        crud.sql(round_check_data, (result) => {
            if (result[0]) {
                const tb_answer_sql = 'UPDATE tb_answer set GRADING_RESULT = ?, MODIFIER_ID = ?, EDIT_DTTM = now() WHERE IDX = ?;';
                const tb_user_sql = 'UPDATE tb_user set GRADING_RESULT = ? WHERE USER_ID = ?;';

                console.log('@@@@@@@@@@@' + USER_ID);

                const data = {
                    query: tb_answer_sql + tb_user_sql,
                    params: [passdivi, USERID, IDX, passdivi, USER_ID],
                };

                crud.sql(data, (result) => {
                    if (result.affectedRows >= 1) {
                        res.send({ status: true });
                    } else {
                        res.send({ status: false });
                    }
                });
            } else {
                res.send({ status: false, message: 'It is not the judging period for that round.' });
            }
        });
    },
};
