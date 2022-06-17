const path = require('path'),
    config = require('config'),
    crud = require('../../model/crud');
const { stringify } = require('querystring');
const fetch = require('node-fetch');

exports.get_qa_view = function (req, res) {
    let qaId = req.query.id;
    if (qaId === undefined) {
        return res.send("<script> alert('error'); window.location.href = '/sub/qa'; </script>");
    }

    let data = {};

    let query_conditon =
        'select ' +
        'qa.IDX, ' +
        'qa.QA_TITLE, ' +
        'qa.QA_TEXT, ' +
        'qa.QA_VWS, ' +
        'qa.QA_STS, ' +
        'ur.USER_NM, ' +
        "date_format(qa.REG_DTTM, '%Y-%m-%d') as REG_DTTM " +
        'from ' +
        'tb_qa qa ' +
        'join tb_user ur on ' +
        'qa.QA_UR_ID = ur.USER_ID ' +
        'where qa.IDX = ?';
    var filter_count = {
        query: query_conditon,
        params: [qaId],
    };
    crud.sql(filter_count, function (result) {
        delete result.meta;
        if (result.length < 1) {
            return res.send("<script> alert('error'); window.location.href = '/sub/qa'; </script>");
        } else {
            data.qaData = result[0];
            let query_conditon =
                'select ' +
                'tqa.QA_ASR_TEXT, ' +
                'ur.USER_NM, ' +
                "date_format(tqa.REG_DTTM, '%Y-%m-%d') as REG_DTTM " +
                'from ' +
                'tb_qa_asr tqa ' +
                'join tb_user ur on ' +
                'tqa.QA_ASR_UR_ID = ur.USER_ID ' +
                'where tqa.QA_IDX = ?; ';
            var filter_count = {
                query: query_conditon,
                params: [qaId],
            };
            crud.sql(filter_count, function (calldata) {
                delete calldata.meta;
                if (calldata.length > 0) {
                    data.qaAnswerData = calldata[0];
                }
                return res.render('./sub/qa_view', { data: data });
            });
        }
    });
};

exports.post_qa_view = function (req, res) {
    if (req.user === undefined) {
        return res.send("<script> alert('do not have permission to answer'); window.location.href = '/sub/qa'; </script>");
    }
    let title = req.body.title;
    let content = req.body.content;
    const qaAnswerUserId = req.user.USER_ID;

    let sql = 'insert into ';
    let table = 'tb_qa ';
    let column = '(qa_title, QA_TEXT, QA_UR_ID, QA_VWS, QA_STS, REG_DTTM) ';
    let values = "values(?, ?, ?, 0, 'NO', now()) ";

    let query_conditon = sql + table + column + values;

    var crud_query = {
        query: query_conditon,
        params: [title, content, qaAnswerUserId],
    };

    crud.sql(crud_query, function (calldata) {
        if (calldata['affectedRows'] == 1) {
            return res.json({
                success: true,
                message: 'request success!',
            });
        } else {
            return res.json({
                success: false,
                message: 'error',
            });
        }
    });
};

exports.get_qa_answer_view = function (req, res) {
    var qaId = req.query.id;
    // 해당 글이 아이디가 없는경우
    if (qaId === undefined) {
        return res.send("<script> alert('error'); window.location.href = '/sub/qa'; </script>");
        // 로그인하지 않았을경우와 로그인 후 권한이 없는 유저가 접근하려 했을 시
    } else if (req.user === undefined || req.user.PERM_CODE != '0000') {
        return res.send("<script> alert('do not have permission to answer'); window.location.href = '/sub/qa'; </script>");
    }

    let data = {};

    let query_conditon =
        'select ' +
        'qa.IDX, ' +
        'qa.QA_TITLE, ' +
        'qa.QA_TEXT, ' +
        'qa.QA_VWS, ' +
        'qa.QA_STS, ' +
        'ur.USER_NM, ' +
        "date_format(qa.REG_DTTM, '%Y-%m-%d') as REG_DTTM " +
        'from ' +
        'tb_qa qa ' +
        'join tb_user ur on ' +
        'qa.QA_UR_ID = ur.USER_ID ' +
        'where qa.IDX = ?';
    var filter_count = {
        query: query_conditon,
        params: [qaId],
    };
    crud.sql(filter_count, function (calldata) {
        delete calldata.meta;
        data.qaData = calldata[0];
        if (calldata.length < 1) {
            return res.send("<script> alert('error'); window.location.href = '/sub/qa'; </script>");
        } else {
            let query_conditon = 'select ' + '* ' + 'from ' + 'tb_qa_asr tqa ' + 'where tqa.QA_IDX = ?';
            var filter_count = {
                query: query_conditon,
                params: [qaId],
            };
            crud.sql(filter_count, function (calldata) {
                delete calldata.meta;
                if (calldata.length > 0) {
                    return res.send("<script> alert('Answered question'); window.location.href = '/sub/qa'; </script>");
                } else {
                    return res.render('./sub/qa_answer', { data: data });
                }
            });
        }
    });
};

exports.get_qa_answer_modify_view = function (req, res) {
    var qaId = req.query.id;
    // 해당 글이 아이디가 없는경우
    if (qaId === undefined) {
        return res.send("<script> alert('error'); window.location.href = '/sub/qa'; </script>");
        // 로그인하지 않았을경우와 로그인 후 권한이 없는 유저가 접근하려 했을 시
    } else if (req.user === undefined || req.user.PERM_CODE != '0000') {
        return res.send("<script> alert('do not have permission to answer'); window.location.href = '/sub/qa'; </script>");
    }

    let data = {};

    let query_conditon =
        'select ' +
        'qa.IDX, ' +
        'qa.QA_TITLE, ' +
        'qa.QA_TEXT, ' +
        'qa.QA_VWS, ' +
        'qa.QA_STS, ' +
        'ur.USER_NM, ' +
        "date_format(qa.REG_DTTM, '%Y-%m-%d') as REG_DTTM " +
        'from ' +
        'tb_qa qa ' +
        'join tb_user ur on ' +
        'qa.QA_UR_ID = ur.USER_ID ' +
        'where qa.IDX = ?';
    var filter_count = {
        query: query_conditon,
        params: [qaId],
    };
    crud.sql(filter_count, function (result) {
        delete result.meta;
        if (result.length < 1) {
            return res.send("<script> alert('error'); window.location.href = '/sub/qa'; </script>");
        } else {
            data.qaData = result[0];
            let query_conditon =
                'select ' +
                'tqa.QA_ASR_TEXT, ' +
                'ur.USER_NM, ' +
                "date_format(tqa.REG_DTTM, '%Y-%m-%d') as REG_DTTM " +
                'from ' +
                'tb_qa_asr tqa ' +
                'join tb_user ur on ' +
                'tqa.QA_ASR_UR_ID = ur.USER_ID ' +
                'where tqa.QA_IDX = ?; ';
            var filter_count = {
                query: query_conditon,
                params: [qaId],
            };
            crud.sql(filter_count, function (calldata) {
                delete calldata.meta;
                console.log('ㅁㅁㅁㅁ' + calldata.length);
                if (calldata.length < 1) {
                    return res.send("<script> alert('This post is unanswered'); window.location.href = '/sub/qa'; </script>");
                }
                data.qaAnswerData = calldata[0];
                return res.render('./sub/qa_modify_view', { data: data });
            });
        }
    });
};

exports.post_qa_answer = function (req, res) {
    const qaIdx = req.body.qaidx;
    const qaAnswerContent = req.body.content;
    const qaAnswerUserId = req.user.USER_ID;
    //요청시 로그인 체크와 권한 체크
    if (req.user === undefined || req.user.PERM_CODE != '0000') {
        return res.json({
            status: false,
            message: 'request fail.',
        });
    }
    let query_conditon = 'select ' + '* ' + 'from ' + 'tb_qa_asr tqa ' + 'where tqa.QA_IDX = ?';
    var filter_count = {
        query: query_conditon,
        params: [qaIdx],
    };
    crud.sql(filter_count, function (calldata) {
        delete calldata.meta;
        //이미 답변된 내용이 있다면 fail 리턴
        if (calldata.length > 0) {
            return res.json({
                status: false,
                message: 'request fail.',
            });
        } else {
            let sql = 'insert into ';
            let table = 'tb_qa_asr ';
            let column = '(QA_IDX, QA_ASR_UR_ID, QA_ASR_TEXT, REG_DTTM) ';
            let values = 'values(?, ?, ?, now()); ';

            let update_sql = 'update ';
            let update_table = 'tb_qa ';
            let update_setColumn = 'set QA_STS = ? ';
            let update_where = 'where IDX = ?; ';

            var crud_query = {
                query: sql + table + column + values + update_sql + update_table + update_setColumn + update_where,
                params: [qaIdx, qaAnswerUserId, qaAnswerContent, 'YES', qaIdx],
            };

            crud.sql(crud_query, function (calldata) {
                if (calldata[0]['affectedRows'] > 0 && calldata[1]['affectedRows'] > 0) {
                    return res.json({
                        status: true,
                        message: 'request success!',
                    });
                } else {
                    return res.json({
                        status: false,
                        message: 'error',
                    });
                }
            });
        }
    });
};

exports.update_qa_views = (req, res) => {
    const qaIdx = req.body.qaidx;
    let update_query_conditon = 'update ' + 'tb_qa ' + 'set QA_VWS = QA_VWS+1 ' + 'where IDX = ?; ';
    var crud_query = {
        query: update_query_conditon,
        params: [qaIdx],
    };
    crud.sql(crud_query, function (calldata) {
        if (calldata['affectedRows'] > 0) {
            return res.json({
                status: true,
                message: 'request success!',
            });
        } else {
            return res.json({
                status: false,
                message: 'error',
            });
        }
    });
};

exports.update_qa_answer = (req, res) => {
    //요청시 로그인 체크와 권한 체크
    if (req.user === undefined || req.user.PERM_CODE != '0000') {
        return res.json({
            status: false,
            message: 'request fail.',
        });
    }
    const content = req.body.content;
    const qaIdx = req.body.qaIdx;
    let update_query_conditon = 'update ' + 'tb_qa_asr ' + 'set QA_ASR_TEXT = ? ' + 'where QA_IDX = ?; ';
    var crud_query = {
        query: update_query_conditon,
        params: [content, qaIdx],
    };
    crud.sql(crud_query, function (calldata) {
        if (calldata['affectedRows'] > 0) {
            return res.json({
                status: true,
                message: 'modify success!',
            });
        } else {
            return res.json({
                status: false,
                message: 'error',
            });
        }
    });
};

exports.delete_qa = (req, res) => {
    const qaIdx = req.params.id;
    let delete_query_conditon = 'delete from tb_qa where IDX = ?; ';
    var crud_query = {
        query: delete_query_conditon,
        params: [qaIdx],
    };
    crud.sql(crud_query, function (calldata) {
        if (calldata['affectedRows'] > 0) {
            return res.json({
                status: true,
                message: 'delete success!',
            });
        } else {
            return res.json({
                status: false,
                message: 'error',
            });
        }
    });
};
