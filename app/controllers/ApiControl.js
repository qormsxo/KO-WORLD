const path = require('path'),
    fs = require('fs'),
    config = require('config'),
    crud = require('../model/crud');
const { stringify } = require('querystring');
const fetch = require('node-fetch');

exports.get_qa_table_list = function (req, res) {
    //console.log('get_assets_table_list --------', req);

    //console.log('get_assets_table_list --------', req.query);
    var offset = req.query.start; //db 검색 시작
    var limit = req.query.length; //페이지에 띄울 row 갯수
    var order_cols = req.query.columns[req.query.order[0].column].data.trim(); //정렬
    var order_asc = req.query.order[0].dir.trim();

    var table = {};
    var params = {};

    table['draw'] = req.query.draw;

    params['offset'] = offset; //start 지점
    params['limit'] = limit; //출력 개수
    params['order_cols'] = order_cols;
    params['order_asc'] = order_asc;

    //console.log('params: ', params);

    var where_condition = ' where 1=1';

    if (req.query.search_keyword != undefined) {
        if (req.query.search_option != undefined) {
            if (req.query.search_option === 'TaC') {
                where_condition += " and qa.QA_TITLE LIKE '%" + req.query.search_keyword + "%' or qa.QA_TEXT LIKE '%" + req.query.search_keyword + "%'";
            } else if (req.query.search_option === 'Writer') {
                where_condition += " and ur.USER_NM LIKE '%" + req.query.search_keyword + "%'";
            }
        }
    }

    //===================================

    //step 1 테이블 count 체크
    var table_name = 'tb_qa qa join tb_user ur on qa.QA_UR_ID = ur.USER_ID';
    var column_select = "qa.IDX, QA_TITLE, USER_NM, QA_VWS, QA_STS, date_format(qa.REG_DTTM, '%Y-%m-%d') as REG_DTTM";
    var query_conditon = 'SELECT count(*) FROM ' + table_name + where_condition;
    var filter_count = {
        query: query_conditon,
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
            'select ' + column_select + ' from ' + table_name + where_condition + ' order by ' + params.order_cols + ' ' + params.order_asc + ' limit ' + params.limit + ' offset ' + params.offset;

        var filter_data = {
            query: sql,
        };

        crud.sql(filter_data, function (docs) {
            table.data = docs; //검색 데이터 넣기
            // console.log("table 2: ", table)
            // console.log('docs: ', docs)
            res.send(table);
        });
    });
};

exports.get_user_table_list = (req, res) => {
    var offset = req.query.start; //db 검색 시작
    var limit = req.query.length; //페이지에 띄울 row 갯수
    var order_cols = req.query.columns[req.query.order[0].column].data.trim(); //정렬
    var order_asc = req.query.order[0].dir.trim();

    var table = {};
    var params = {};

    table['draw'] = req.query.draw;

    params['offset'] = offset; //start 지점
    params['limit'] = limit; //출력 개수
    params['order_cols'] = order_cols;
    params['order_asc'] = order_asc;

    //console.log('params: ', params);

    var where_condition = ' where 1=1';

    var where_condition = ' where 1=1';

    if (req.query.search_keyword != undefined) {
        if (req.query.search_option != undefined) {
            if (req.query.search_option === 'IaU') {
                where_condition += " and tu.USER_ID LIKE '%" + req.query.search_keyword + "%' or tu.USER_NM LIKE '%" + req.query.search_keyword + "%'";
            } else if (req.query.search_option === 'email') {
                where_condition += " and tu.EMAIL LIKE '%" + req.query.search_keyword + "%'";
            } else if (req.query.search_option === 'PaG') {
                where_condition += " and tp.PERM_NM_KR LIKE '%" + req.query.search_keyword + "%' or tg.GRADE_NM_KR LIKE '%" + req.query.search_keyword + "%'";
            }
        }
    }
    //===================================

    //step 1 테이블 count 체크
    var table_name = 'tb_user tu join tb_perm tp on tu.PERM_CODE = tp.PERM_CODE join tb_grade tg on tu.PERM_CODE = tg.PERM_CODE and tu.GRADE_CODE = tg.GRADE_CODE ';
    var column_select =
        "tu.IDX, tu.USER_ID, tu.USER_NM, date_format(tu.BIRTHDAY, '%Y-%m-%d') as BIRTHDAY , tu.NATIONALITY, tu.SCH_NM, tu.EMAIL, tp.PERM_NM_KR, tp.PERM_NM_EN, tg.GRADE_NM_KR, tg.GRADE_NM_EN, date_format(tu.REG_DTTM, '%Y-%m-%d') as REG_DTTM, tu.ACCEPT ";
    var query_conditon = 'SELECT count(*) FROM ' + table_name + where_condition;
    var filter_count = {
        query: query_conditon,
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
            'select ' + column_select + ' from ' + table_name + where_condition + ' order by ' + params.order_cols + ' ' + params.order_asc + ' limit ' + params.limit + ' offset ' + params.offset;

        var filter_data = {
            query: sql,
        };

        crud.sql(filter_data, function (docs) {
            table.data = docs; //검색 데이터 넣기
            res.send(table);
        });
    });
};

// exports.delete_notice = (req, res) => {
//     var notice_num = req.body.data;

//     var sql = 'delete from notice_tb where id = ?';

//     var filter_data = {
//         query: sql,
//         params: [notice_num],
//     };

//     crud.select(filter_data, function (docs) {
//         res.send(docs);
//     });
// };
// exports.insert_inquiry = async (req, res) => {
//     const secretKey = config.secretKey;

//     const query = stringify({
//         secret: secretKey,
//         response: req.body['g-recaptcha-response'],
//     });

//     const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

//     const body = await fetch(verifyURL).then((res) => res.json());

//     if (body.success !== undefined && !body.success) return res.json({ success: false, msg: 'Failed captcha verification' });

//     var inquiryType = req.body.inquirytype;
//     var name = req.body.name;
//     var email = req.body.email;
//     var phoneNum = req.body.phoneNum;
//     var compName = req.body.compName;
//     var content = req.body.content;

//     var columns = ' (inquiry_type, inquiry_name, inquiry_email, inquiry_phone, ' + 'inquiry_comp_name, inquiry_content, inquiry_date) ';

//     var values = ' (?, ?, ?, ?, ?, ?, now())';

//     var sql = 'insert into inquiry_tb ' + columns + ' values ' + values;

//     var filter_data = {
//         query: sql,
//         params: [inquiryType, name, email, phoneNum, compName, content],
//     };

//     crud.select(filter_data, function (docs) {
//         res.send(docs);
//     });
// };

// exports.insert_notice = (req, res) => {
//     // console.log(req.body);
//     var title = req.body.title;
//     var editordata = req.body.editordata;
//     var noticeType = req.body.noticeType;
//     var showDate = req.body.showDate;

//     var columns = ' (type, title, content, hit, date, showdate) ';

//     var values = ' (?, ?, ?, 0, CURDATE(), ?)';

//     var sql = 'insert into notice_tb ' + columns + ' values ' + values;

//     var filter_data = {
//         query: sql,
//         params: [noticeType, title, editordata, showDate],
//     };

//     crud.select(filter_data, function (docs) {
//         res.send(docs);
//     });
// };

// exports.update_notice = (req, res) => {
//     // console.log(req.body);
//     var id = req.body.id;
//     var noticeType = req.body.noticeType;
//     var title = req.body.title;
//     var editordata = req.body.editordata;
//     var showdate = req.body.showdate;

//     var columns = ' type = ?, title = ?, content = ?, showdate = ? ';

//     var where = ' id = ? ';

//     var sql = 'update notice_tb set ' + columns + ' where ' + where;

//     var filter_data = {
//         query: sql,
//         params: [noticeType, title, editordata, showdate, id],
//     };

//     crud.select(filter_data, function (docs) {
//         res.send(docs);
//     });
// };
