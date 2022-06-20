const { equal } = require('assert');
const path = require('path'),
    crud = require('../../model/crud');
const zipper = require('multer-zip').default;
const fs = require('fs');

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

        let type = req.query.type;

        console.log(type == 'high' ? '0000' : '0001');

        table['draw'] = req.query.draw;

        params['offset'] = offset; //start 지점
        params['limit'] = limit; //출력 개수
        params['order_cols'] = order_cols;
        params['order_asc'] = order_asc;

        //console.log('params: ', params);

        let where_condition = "WHERE tu.ACCEPT = '1' AND tu.GRADE_CODE  = ?";

        //===================================

        //테이블 count
        let table_name = ' tb_answer ta  INNER JOIN tb_user tu ON ta.USER_ID = tu.USER_ID ';
        let column_select =
            " tu.USER_ID, tu.USER_NM ,date_format(tu.BIRTHDAY , '%Y-%m-%d') as BIRTHDAY,tu.NATIONALITY , tu.EMAIL , ta.ANS_SCORE ," +
            'DENSE_RANK() OVER(ORDER BY ta.ANS_SCORE  DESC ) AS ranking ';
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
        const { user } = req.query;
        const sql = 'SELECT ANS_FILE_PATH , ANS_FILE_NAME FROM tb_answer WHERE USER_ID = ?';

        const data = {
            query: sql,
            params: [user],
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
    maxConSet: (req, res) => { },
    answer: (req, res) => { },
};
