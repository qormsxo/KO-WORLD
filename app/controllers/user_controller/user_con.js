const path = require('path'),
    config = require('config'),
    crud = require('../../model/crud');
const { stringify } = require('querystring');
const fetch = require('node-fetch');

exports.update_user_accept = (req, res) => {
    const qaIdx = req.body.qaidx;
    let status = req.body.status;
    if (status === 'true') {
        status = 1;
    } else {
        status = 0;
    }
    let update_query_conditon = 'update ' + 'tb_user ' + 'set ACCEPT = ? ' + 'where IDX = ?; ';
    var crud_query = {
        query: update_query_conditon,
        params: [status, qaIdx],
    };
    crud.sql(crud_query, function (calldata) {
        console.log(update_query_conditon);
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
