const mariadb = require('mariadb');
const config = require('config');

const pool = mariadb.createPool(config.get('mariadb_option'));

// select
//mariadb select
const db_name = 'ko_world'; // 스키마이름

async function db_select(Model, db_query, db_params, callback) {
    let conn, rows;
    try {
        conn = await Model.getConnection();
        conn.query('USE ' + db_name);
        rows = await conn.query(db_query, db_params);
        await conn.commit();
    } catch (err) {
        console.log(err);
        await conn.rollback();
        //callback(err);
        throw err;
    } finally {
        if (conn) conn.end();
        callback(rows);
    }
}

//mariadb select query 수행 1
exports.sql = function (data, callback) {
    var db_query = data.query;
    var db_params = data.params;
    db_select(pool, db_query, db_params, function (result) {
        callback(result);
    });
};

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// table count 체크
// exports.count_chk = function(data, callback) {
//     var db_query = data.query;
//     var db_params = data.params;
//     db_select(pool, db_query,db_params, function(result) {
//         callback(result)
//     });
// }
