var fs = require('fs');
var path = require('path');

module.exports = function (app) {
    app.get('/', (req, res) => {
        console.log(req.user);
        res.render('index');
        // var errorMsg = req.flash().error // 로그인실패시 들어오는 메세지 (!!!!!!!!!!!한번 사용하면 사라짐!!!!!!!!!!!!!!!)
        // if (errorMsg) {
        // 	res.send("<script> alert('" + errorMsg + "'); window.location.href = '/login'; </script>") // 에러 뜰때
        // } else {
        // 	var main_path = path.join(__dirname + '/../../public/views/main.html');
        // 	res.render(main_path);
        // }
    });
};
