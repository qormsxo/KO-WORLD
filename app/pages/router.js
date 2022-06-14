module.exports = function (app) {
    // app setting
    require('./express')(app); //현재폴더(project_test/app/connect) 기준 미들웨어 사용 설정

    require('../routers/main')(app);
    require('../routers/page_router/page_router')(app);
    require('../routers/sub_router/sub_router')(app);
    require('../routers/api/ApiControl')(app);
    require('../routers/challenge_router')(app);
    require('../routers/account_router/login_router')(app);
    require('../routers/account_router/register_route')(app);
    require('../../passport/passport.js')(); // 로그인
};
