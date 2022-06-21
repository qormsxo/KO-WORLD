$(function () {
    $('#content').on('keyup', function () {
        if ($(this).val().length > 2000) {
            $(this).val($(this).val().substring(0, 2000));
        }
    });
});

var IDX = $('#IDX').val();
let qaModifyViewPage = {
    fd: null,
    qaAnswerModifyRequest: () => {
        qaModifyViewPage.fd = new FormData($('#qaAnswerModifyForm')[0]);

        for (let key of qaModifyViewPage.fd.keys()) {
            if (qaModifyViewPage.fd.get(key) === '') {
                alert(`Please enter ${key}`);
                return;
            }
        }
        const data = new URLSearchParams(qaModifyViewPage.fd);
        qaModifyViewPage.request(data);
    },
    request: async (data) => {
        try {
            let response = await fetch('/sub/qa/answer/modify', {
                method: 'post',
                body: data,
            });
            let responseData = await response.json();
            if (responseData.status) {
                alert(responseData.message);
                window.location.href = '/sub/qa';
            } else {
                alert(responseData.message);
            }
        } catch (err) {
            console.error(new Error('error'));
        }
    },
};
