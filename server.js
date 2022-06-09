// 사용 모듈 참조
var express = require('express'),
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

// 서버 접속 시 연결 page 관련
require(path.join(__dirname, 'app/pages/router.js'))(app);
//console.log("PATH:", __dirname)
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));
//포트 설정(config에서 가져오기)
app.set('port', config.get('port'));

//서버 실행
server.listen(app.get('port'), function () {
	var dir = './uploadFiles';
	if (!fs.existsSync(dir)) fs.mkdirSync(dir); //업로드 폴더 없을시 생성
	console.log('##Server port ' + app.get('port'));
});
