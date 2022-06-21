$('#password_change_modal_btn').on('click', function () {
    $('#password_change_modal').modal('show');
});

$('#create_admin_modal_btn').on('click', function () {
    $('#create_admin_modal').modal('show');
});

$('.modal_close').on('click', function () {
    $('#password_change_modal').modal('hide');
    $('#create_admin_modal').modal('hide');
});

var password_check_status = 0;

$('#current_password_check').on('click', function () {
    let current_password = $('#current_password').val();
    if (current_password === '') {
        alert('Please enter your current password');
    } else {
        $.ajax({
            type: 'get',
            url: '/user/password_check',
            data: { current_password: current_password },
            success: function (result) {
                if (result.status === true) {
                    alert(result.message);
                    $('#current_password_check').css({ 'background-color': 'green', color: 'white' });
                    $('#current_password').attr('disabled', true);
                    $('#current_password_check').attr('disabled', true);
                    password_check_status = 1;
                } else {
                    alert(result.message);
                    $('#current_password_check').css({ 'background-color': 'red', color: 'white' });
                    password_check_status = 0;
                }
            },
            error: function (a, b, c) {
                alert(a + b + c);
            },
        });
    }
});

//8 ~ 16자 영문, 숫자, 특수문자를 최소 한가지씩 조합
let passwordReg = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
$('#modify_password_btn').on('click', function () {
    let pw = $('#modify_password').val();
    if (password_check_status === 0) {
        alert('Please Check Your Current Password');
    } else if (pw === '') {
        alert('Please enter Modify Password');
    } else if (!passwordReg.test(pw)) {
        alert('Password must be 8 to 16 characters and contain special characters.');
    } else {
        $.ajax({
            type: 'patch',
            url: '/user/password_modify',
            data: { modify_password: pw },
            success: function (result) {
                if (result.status === true) {
                    alert(result.message);
                    location.href = '/user/user_profile';
                } else {
                    alert(result.message);
                }
            },
            error: function (a, b, c) {
                alert(a + b + c);
            },
        });
    }
});

$('#create_normal_admin_btn').on('click', function () {
    var fd = new FormData($('#createForm')[0]);

    for (let key of fd.keys()) {
        if (fd.get(key) === '') {
            alert(`Please enter ${key}`);
            return;
        }
    }
    // 아이디 영문자로 시작하는 영문자 또는 숫자 6~16자
    let idReg = /^[a-z]+[a-z0-9]{5,15}$/g;
    //8 ~ 16자 영문, 숫자, 특수문자를 최소 한가지씩 조합
    let passwordReg = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
    // 이메일 체크 정규식
    let emailREg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    let id = $('#id').val();
    let pw = $('#password').val();
    let email = $('#email').val();
    // 아이디검사
    if (!idReg.test(id)) {
        alert('ID must be at least 6 to 20 characters and must be lowercase.');
    } else if (idCheck(id)) {
        //아이디 중복확인
        alert('ID is already taken');
    } else if (!passwordReg.test(pw)) {
        alert('Password must be 8 to 16 characters and contain special characters.');
    } else if (!emailREg.test(email)) {
        alert('Invalid email');
    } else {
        const data = new URLSearchParams(fd);
        $.ajax({
            type: 'post',
            url: '/user/normal_admin',
            data: data,
            contentType: false,
            processData: false,
            success: function (result) {
                if (result.status === true) {
                    alert(result.message);
                    location.href = '/user/user_profile';
                } else {
                    alert(result.message);
                }
            },
            error: function (a, b, c) {
                alert(a + b + c);
            },
        });
    }
});

function idCheck(id) {
    $.ajax({
        type: 'get',
        url: '/id/check?',
        data: { id: id },
        success: function (result) {
            if (result.ok) {
                return true;
            } else {
                return false;
            }
        },
        error: function (a, b, c) {
            alert(a + b + c);
        },
    });
}

$('#create_admin_modal').on('show.bs.modal', function () {
    $('#id').val('');
    $('#password').val('');
});

$('#password_change_modal').on('hidden.bs.modal', function () {
    $('#current_password_check').css({ 'background-color': 'white', color: 'gray' });
    $('#current_password').attr('disabled', false);
    $('#current_password_check').attr('disabled', false);
    $('#current_password').val('');
    password_check_status = 0;
});
