$('#password_change_modal_btn').on('click', function () {
    $('#password_change_modal').modal('show');
});

$('#create_admin_modal_btn').on('click', function () {
    $('#create_admin_modal').modal('show');
});

$('#my_infomation_save_btn').on('click', function () {
    var fd = new FormData($('#regsiterForm')[0]);
    for (let key of fd.keys()) {
        if (fd.get(key) === '') {
            alert(`Please enter ${key}`);
            return;
        }
    }
    // 이메일 체크 정규식
    let emailREg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    let email = $('#user_eamil').val();
    if (!emailREg.test(email)) {
        alert('Invalid email');
    } else {
        $('#my_infomation_save_modal').modal('show');
    }
});

$('.modal_close').on('click', function () {
    $('#password_change_modal').modal('hide');
    $('#create_admin_modal').modal('hide');
    $('#my_infomation_save_modal').modal('hide');
});

var password_check_status = 0;
var save_my_info_password_check_status = 0;

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

$('#my_answer').on('click', () => {
    $.ajax({
        type: 'get',
        url: '/user/answer',
        success: function (response) {
            console.log(response);
            let html = '';
            $('#user_answer_table').find('tbody').children().remove();
            for (let i = 0; i < response.length; i++) {
                html +=
                    `<tr><td>${response[i].round_ord}</td><td>${response[i].user_nm}</td>` +
                    `<td><a class="answer" value=${response[i].idx}>answer</a></td>` +
                    `<td><a href="/answer/file?IDX=${response[i].idx}">download</a></td>` +
                    `<td>${response[i].ans_score == null ? 'wait' : response[i].ans_score}</td>` +
                    `<td><b>${response[i].grading_result == null ? 'wait' : response[i].grading_result}<b></td></tr> `;
            }
            $('#user_answer_table').find('tbody').append(html);
            $('#user_answer_modal').modal('show');
            $('#user_answer_table').find('th').css('display', 'table-cell');
        },
    });
});
$(document).on('click', '.answer', function (e) {
    $.ajax({
        type: 'get',
        url: '/answer/user',
        data: { IDX: $(e.target).attr('value') },
        dataType: 'json',
        success: function (response) {
            //console.log(response);
            $('#userAnswer').children().remove();
            let html = '';
            for (let i = 0; i < response.length; i++) {
                html += `<div class='col-12'> ${i + 1}. ${response[i]} </div>`;
            }
            $('#userAnswer').append(html);
            $('#answerModal').modal('show');
        },
    });
});

$('#save_info_current_password_check').on('click', function () {
    let save_info_current_password = $('#save_info_current_password').val();
    if (save_info_current_password === '') {
        alert('Please enter your current password');
    } else {
        $.ajax({
            type: 'get',
            url: '/user/password_check',
            data: { current_password: save_info_current_password },
            success: function (result) {
                if (result.status === true) {
                    alert(result.message);
                    $('#save_info_current_password_check').css({ 'background-color': 'green', color: 'white' });
                    $('#save_info_current_password').attr('disabled', true);
                    $('#save_info_current_password_check').attr('disabled', true);
                    save_my_info_password_check_status = 1;
                } else {
                    alert(result.message);
                    $('#save_info_current_password_check').css({ 'background-color': 'red', color: 'white' });
                    save_my_info_password_check_status = 0;
                }
            },
            error: function (a, b, c) {
                alert(a + b + c);
            },
        });
    }
});

$('#my_infomation_save_request_btn').on('click', function () {
    if (save_my_info_password_check_status === 0) {
        alert('Please Check Your Current Password');
    } else {
        const data = new URLSearchParams(new FormData($('#regsiterForm')[0]));
        console.log(data.toString());
        $.ajax({
            type: 'patch',
            url: '/user/info_modify',
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

//8 ~ 16자 영문, 숫자, 특수문자를 최소 한가지씩 조합
let passwordReg = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
$('#modify_password_btn').on('click', function () {
    let pw = $('#modify_password').val();
    let pwChk = $('#modify_password_check').val();
    if (password_check_status === 0) {
        alert('Please Check Your Current Password');
    } else if (pw === '') {
        alert('Please enter Modify Password');
    } else if (!passwordReg.test(pw)) {
        alert('Password must be 8 to 16 characters and contain special characters.');
    } else if (pw !== pwChk) {
        alert('password do not match');
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
    let pwChk = $('#password_check').val();
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
    } else if (pw !== pwChk) {
        alert('password do not match');
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

$('#my_infomation_save_modal').on('hidden.bs.modal', function () {
    $('#save_info_current_password_check').css({ 'background-color': 'white', color: 'gray' });
    $('#save_info_current_password').attr('disabled', false);
    $('#save_info_current_password_check').attr('disabled', false);
    $('#save_info_current_password').val('');
    save_my_info_password_check_status = 0;
});
