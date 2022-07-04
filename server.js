// 사용 모듈 참조
const helmet = require('helmet');
const express = require('express'),
    //, routes = require('./routes')
    //, user = require('./routes/user')
    http = require('http'),
    path = require('path'),
    config = require('config'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    fs = require('fs');

//서버 생성
var app = express();
var server = http.createServer(app);
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: ["'self'"],
//             'script-src': ["'self'"],
//             'style-src': null,
//         },
//     })
// );
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
// app.use(
//     helmet({
//       frameguard: false,
//     })
//   );
// 서버 접속 시 연결 page 관련
require(path.join(__dirname, 'app/pages/router.js'))(app);

//정의된 경로 중 아무것도 타지 않았을때
app.get('*', function (req, res) {
    var main_path = path.join(__dirname, '/public/views/404.ejs');

    res.render(main_path);
});

app.put('/products', function (req, res) {
    const { id, name, description } = req.body;
    console.log(req.body);
    res.send(`Name ${id} ${name}, desc ${description}`);
});

//console.log("PATH:", __dirname)

//포트 설정(config에서 가져오기)
app.set('port', config.get('port'));

//서버 실행
server.listen(app.get('port'), function () {
    var dir = './uploadFiles';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir); //업로드 폴더 없을시 생성
    console.log('##Server port ' + app.get('port'));
});
