$(function () {
    $('#content').on('keyup', function () {
        if ($(this).val().length > 2000) {
            $(this).val($(this).val().substring(0, 2000));
        }
    });
});

let qaAnswerPage = {
    fd: null,
    qaNullChk: () => {
        qaAnswerPage.fd = new FormData($('#qaAnswerForm')[0]);

        for (let key of qaAnswerPage.fd.keys()) {
            if (qaAnswerPage.fd.get(key) === '') {
                alert(`Please enter ${key}`);
                return;
            }
        }
        const data = new URLSearchParams(qaAnswerPage.fd);
        qaAnswerPage.request(data);
    },
    request: async (data) => {
        try {
            let response = await fetch('/sub/qa/answer', {
                method: 'POST',
                body: data,
            });
            let responseData = await response.json();
            if (responseData.status) {
                alert(responseData.message);
                window.location.href = '/sub/qa';
            } else if (!responseData.status) {
                alert(responseData.message);
                window.location.href = '/sub/qa';
            }
        } catch (err) {
            console.error(new Error('error'));
        }
    },
};
