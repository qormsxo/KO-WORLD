const path = require('path'),
    crud = require('../../model/crud');
const { stringify } = require('querystring');
const bcrypt = require('bcrypt');
const rounds = 10;

module.exports = {
    register: async (req, res) => {
        //console.log(req.body);
        let { state, name, id, password, email, birth, nationality, schoolName } = req.body;
        let permCode = {
            highschool: '0002',
            college: '0002',
            commitee: null,
        };
        // let gradeCode = {
        //     highschool: '0000',
        //     college: '0001',
        // };
        let encryptedPW = await bcrypt.hash(password, rounds);

        let sql = 'INSERT INTO tb_user ';
        let params = [];
        if (state == 'commitee') {
            sql += '(USER_ID, USER_PWD, USER_NM, EMAIL, PERM_CODE, REG_DTTM, ACCEPT)' + `VALUES(?,?,?,?,?,NOW(),'0')`;
            params.push(id, encryptedPW, name, email, permCode[state]);
        } else {
            sql +=
                '(USER_ID, USER_PWD, USER_NM, BIRTHDAY, NATIONALITY, SCH_NM, EMAIL, PERM_CODE, GRADE_CODE, REG_DTTM, ACCEPT)' +
                `VALUES(?,?,?,?,?,?,?,?,?,NOW(),'1')`;
            params.push(id, encryptedPW, name, birth, nationality, schoolName, email, permCode[state], state == 'highschool' ? '0000' : '0001');
        }
        //console.log(sql, params);

        let filter_data = {
            query: sql,
            params: params,
        };

        crud.sql(filter_data, (result) => {
            console.log(result);
            if (result['affectedRows'] == 1) {
                res.json({
                    success: true,
                    message: 'Welcome!',
                });
            } else {
                res.json({
                    success: false,
                    message: 'error',
                });
            }
        });
    },
    idChk: (req, res) => {
        console.log(req.query);
        let id = req.query.id;
        let sql = 'SELECT user_id FROM tb_user WHERE user_id = ?';
        let checkData = {
            query: sql,
            params: [id],
        };

        crud.sql(checkData, (result) => {
            //console.log(result[0] == undefined);
            if (result[0] == null) {
                res.sendStatus(200);
            } else {
                res.sendStatus(404);
            }
        });
    },
};
