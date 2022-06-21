const path = require('path'),
    config = require('config'),
    crud = require('../../model/crud');
const { stringify } = require('querystring');
const fetch = require('node-fetch');
const bcrypt = require('bcrypt');
const rounds = 10;

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

exports.update_committee_grade = (req, res) => {
    const qaIdx = req.body.qaidx;
    let status = req.body.status;

    if (qaIdx === undefined) {
        return res.send("<script> alert('error'); window.location.href = '/'; </script>");
        // 로그인하지 않았을경우와 로그인 후 권한이 없는 유저가 접근하려 했을 시
    } else if (req.user === undefined || req.user.PERM_CODE != '0000') {
        return res.send("<script> alert('do not have permission to answer'); window.location.href = '/'; </script>");
    }

    let update_query_conditon = 'update ' + 'tb_user ' + 'set GRADE_CODE = ? ' + 'where IDX = ?; ';
    var crud_query = {
        query: update_query_conditon,
        params: [status, qaIdx],
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

exports.get_user_profile_view = (req, res) => {
    // 로그인하지 않았을경우와 로그인 후 권한이 없는 유저가 접근하려 했을 시
    if (req.user === undefined) {
        return res.send("<script> alert('do not have permission to answer'); window.location.href = '/'; </script>");
    }
    let user_id = req.user.USER_ID;
    let query_select_column = "SELECT USER_ID,USER_NM,date_format(BIRTHDAY,'%Y-%m-%d') as BIRTHDAY,NATIONALITY,SCH_NM,EMAIL, tg.GRADE_NM_EN as GRADE, ANSWER, tg.GRADE_CODE ";
    let query_table = 'FROM TB_USER tu LEFT JOIN TB_GRADE tg on tu.PERM_CODE = tg.PERM_CODE and tu.GRADE_CODE = tg.GRADE_CODE ';
    let query_where = 'WHERE USER_ID = ?';
    let query_condition = query_select_column + query_table + query_where;
    var crud_query = {
        query: query_condition,
        params: [user_id],
    };
    crud.sql(crud_query, function (calldata) {
        delete calldata.meta;
        res.render('./user/user_profile', { data: calldata[0] });
    });
    // res.render('./user/user_profile');
};

exports.user_password_check = (req, res) => {
    let user_id = req.user.USER_ID;
    let password = req.query.current_password;

    let query_select_column = 'SELECT USER_PWD ';
    let query_table = 'FROM TB_USER ';
    let query_where = 'WHERE USEr_ID = ?';

    let query_condition = query_select_column + query_table + query_where;

    var crud_query = {
        query: query_condition,
        params: [user_id],
    };
    crud.sql(crud_query, function (calldata) {
        delete calldata.meta;

        bcrypt.compare(password, calldata[0].USER_PWD, function (err, bcryptRes) {
            if (err) {
                console.log(err.message);
            } else {
                if (bcryptRes) {
                    return res.json({
                        status: true,
                        message: 'Matches your current password!',
                    });
                } else {
                    return res.json({
                        status: false,
                        message: 'Your current password does not match!',
                    });
                }
            }
        });
    });
};

exports.update_user_password = async (req, res) => {
    // 로그인하지 않았을경우와 로그인 후 권한이 없는 유저가 접근하려 했을 시
    if (req.user === undefined) {
        return res.send("<script> alert('do not have permission to answer'); window.location.href = '/'; </script>");
    }

    const modify_password = req.body.modify_password;
    const user_id = req.user.USER_ID;

    let encryptedPW = await bcrypt.hash(modify_password, rounds);

    let update_query_conditon = 'update ' + 'tb_user ' + 'set USER_PWD = ? ' + 'where user_id = ?; ';
    var crud_query = {
        query: update_query_conditon,
        params: [encryptedPW, user_id],
    };
    crud.sql(crud_query, function (calldata) {
        console.log(update_query_conditon);
        if (calldata['affectedRows'] > 0) {
            return res.json({
                status: true,
                message: 'Your password has been changed successfully!',
            });
        } else {
            return res.json({
                status: false,
                message: 'Failed to change password',
            });
        }
    });
};

exports.post_normal_admin = async (req, res) => {
    var id = req.body.id;
    var password = req.body.password;
    var name = req.body.name;
    var email = req.body.email;

    // 로그인하지 않았을경우와 로그인 후 권한이 없는 유저가 접근하려 했을 시
    if (req.user === undefined || req.user.PERM_CODE != '0000') {
        return res.send("<script> alert('do not have permission to answer'); window.location.href = '/'; </script>");
    }

    let encryptedPW = await bcrypt.hash(password, rounds);

    let insert_query_sql = 'insert into ';
    let insert_query_table = 'tb_user ';
    let insert_query_column = ' (USER_ID, USER_PWD, USER_NM, EMAIL, PERM_CODE, GRADE_CODE, REG_DTTM, ACCEPT) ';
    let insert_query_values = " values (?, ?, ?, ?, '0000', '0001', now(), 1)";
    var crud_query = {
        query: insert_query_sql + insert_query_table + insert_query_column + insert_query_values,
        params: [id, encryptedPW, name, email],
    };
    crud.sql(crud_query, function (calldata) {
        if (calldata['affectedRows'] > 0) {
            return res.json({
                status: true,
                message: 'A regular admin account has been created!',
            });
        } else {
            return res.json({
                status: false,
                message: 'Account creation failed',
            });
        }
    });
};
