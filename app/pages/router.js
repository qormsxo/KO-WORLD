module.exports = function (app) {
    // app setting
    require('./express')(app); //현재폴더(project_test/app/connect) 기준 미들웨어 사용 설정

    require('../routers/main')(app);
    require('../routers/page_router/page_router')(app);
    require('../routers/sub_router/sub_router')(app);
    require('../routers/api/ApiControl')(app);
    require('../routers/login')(app);
    require('../routers/register_route')(app);

    require('../../passport/passport.js')(); // 로그인
};
