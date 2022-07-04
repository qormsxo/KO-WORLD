const path = require('path'),
    crud = require('../../model/crud');
const { stringify } = require('querystring');
const bcrypt = require('bcrypt');
const rounds = 10;
const sanitizeHtml = require('sanitize-html');

module.exports = {
    register: (req, res) => {
        console.log(req.body);
        // xss
        for (var key in req.body) {
            if (req.body[key] == '') continue; // null 이면
            req.body[key] = sanitizeHtml(req.body[key], { allowedTags: [] });
            console.log(req.body[key]);
        }
        // 아이디 체크 함수
        const idChk = (id, func) => {
            let sql = 'SELECT user_id FROM tb_user WHERE user_id = ?';
            let checkData = {
                query: sql,
                params: [id],
            };
            console.log(id);

            crud.sql(checkData, (result) => {
                // console.log(result);
                // console.log(result[0] == null);
                if (result[0] == null) {
                    return func(true);
                } else {
                    return func(false);
                }
            });
        };
        // 회원가입 함수
        const regFunc = (sql, params) => {
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
        };
        //아이디 중복체크
        idChk(req.body.id, async (result) => {
            if (result) {
                // 사용가능한 아이디 일때
                // 변수 선언
                let { state, name, id, password, email, birth, nationality, schoolName } = req.body;

                // xss 검사이후에 name이 null이 아닌경우
                let permCode = {
                    highschool: '0002',
                    college: '0002',
                    commitee: '0001',
                };
                // let gradeCode = {
                //     highschool: '0000',
                //     college: '0001',
                // };
                // 비밀번호 암호화
                let encryptedPW = await bcrypt.hash(password, rounds);

                let sql = 'INSERT INTO tb_user ';
                let params = [];
                // 심사위원의 경우
                if (state == 'commitee') {
                    // xss 검사 이후에 아래항목들이 비었을때
                    if (name == '' || id == '' || email == '') {
                        return res.json({
                            success: false,
                            message: 'Please enter without empty value',
                        });
                    }
                    sql += '(USER_ID, USER_PWD, USER_NM, EMAIL, PERM_CODE , GRADE_CODE ,  REG_DTTM, ACCEPT)' + `VALUES(?,?,?,?,?,?,NOW(),'0')`;
                    params.push(id, encryptedPW, name, email, permCode[state], '0000');
                    regFunc(sql, params);
                } else {
                    // 참가자의 경우
                    // xss 검사 이후에  아래 항목들이 비었을때
                    if ((name == '' || id == '' || email == '' || birth == '', nationality == '', schoolName == '')) {
                        return res.json({
                            success: false,
                            message: 'Please enter without empty value',
                        });
                    }
                    sql +=
                        '(USER_ID, USER_PWD, USER_NM, BIRTHDAY, NATIONALITY, SCH_NM, EMAIL, PERM_CODE, GRADE_CODE, REG_DTTM, ACCEPT)' +
                        `VALUES(?,?,?,?,?,?,?,?,?,NOW(),'1')`;
                    params.push(
                        id,
                        encryptedPW,
                        name,
                        birth,
                        nationality,
                        schoolName,
                        email,
                        permCode[state],
                        state == 'highschool' ? '0000' : '0001'
                    );
                    regFunc(sql, params);
                }
                //console.log(sql, params);
            } else {
                // 이미 사용중인 아이디 일때
                res.json({
                    success: false,
                    message: 'ID is already taken',
                });
            }
        });
    },
};
