$(function () {
    $('input:radio[name=state]').on('click', function () {
        if ($(this).val() == 'commitee') {
            $('#studentItem').hide();
        } else {
            $('#studentItem').show();
        }
    });
});

let registerNullChk = () => {
    let fd = new FormData($('#regsiterForm')[0]);
    // for (let value of fd.values()) {
    //     console.log(value);
    // }
    for (let key of fd.keys()) {
        if (fd.get(key) === '') {
            // commitee면 제외되는 항목
            if ($('input:radio[name=state]:checked').val() == 'commitee' && (key == 'birth' || key == 'nationality' || key == 'schoolName')) {
                console.log(key);
                continue;
            }

            alert(`Please enter ${key}`);
            return;
        }
        // console.log(`${key}:${fd.get(key)}`);
    }
    // 아이디 영문자로 시작하는 영문자 또는 숫자 6~20자
    let idReg = /^[a-z]+[a-z0-9]{5,19}$/g;
    //8 ~ 16자 영문, 숫자, 특수문자를 최소 한가지씩 조합
    let passwordReg = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/;
    // 이메일 체크 정규식
    let emailREg = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    let id = $('#id').val();
    let pw = $('#password').val();
    let pwChk = $('#passwordCheck').val();
    let email = $('#email').val();

    if (!idReg.test(id)) {
        alert('ID must be at least 6 to 20 characters and must be lowercase.');
        console.log('???', id.length);
    } else if (!passwordReg.test(pw)) {
        alert('Password must be 8 to 16 characters and contain special characters.');
    } else if (pw !== pwChk) {
        alert('password do not match');
    } else if (!emailREg.test(email)) {
        alert('Invalid email');
    } else {
        $('#regsiterForm').trigger('submit');
    }
    //Email is already taken

    // e.preventdefault();
};
