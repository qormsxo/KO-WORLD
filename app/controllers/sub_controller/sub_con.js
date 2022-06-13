const path = require('path'),
    config = require('config'),
    crud = require('../../model/crud');
const { stringify } = require('querystring');
const fetch = require('node-fetch');

exports.get_qa_view = function (req, res) {
    let qaId = req.query.id;

    let query_conditon =
        'select ' +
        'qa.IDX, ' +
        'qa.QA_TITLE, ' +
        'qa.QA_TEXT, ' +
        'qa.QA_VWS, ' +
        'qa.QA_STS, ' +
        'ur.USER_NM, ' +
        'qa.REG_DTTM, ' +
        'tqa.ASR_USER_NM, ' +
        'tqa.QA_ASR_TEXT, ' +
        'tqa.ASR_REG_DTTM ' +
        'from ' +
        'tb_qa qa ' +
        'join tb_user ur on ' +
        'qa.QA_UR_ID = ur.USER_ID ' +
        'join ( ' +
        'select ' +
        'tqa.IDX as tqaIDX, ' +
        'tqa.QA_ASR_TEXT, ' +
        'ur.USER_NM as ASR_USER_NM, ' +
        'tqa.REG_DTTM as ASR_REG_DTTM ' +
        'from ' +
        'ta_qa_asr tqa ' +
        'join tb_user ur on ' +
        'tqa.QA_ASR_UR_ID = ur.USER_ID) tqa ' +
        'where qa.IDX = ?';
    var filter_count = {
        query: query_conditon,
        params: [qaId],
    };
    crud.sql(filter_count, function (calldata) {
        delete calldata.meta;
        if (calldata.length < 1) {
            res.send("<script> alert('error'); window.location.href = '/sub/qa'; </script>");
        } else {
            res.render('./sub/qa_view');
        }
    });
};
