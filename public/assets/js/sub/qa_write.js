$(function () {
    $('#content').on('keyup', function () {
        if ($(this).val().length > 500) {
            $(this).val($(this).val().substring(0, 500));
        }
    });
});

let qaWritePage = {
    fd: null,
    qaNullChk: () => {
        qaWritePage.fd = new FormData($('#qaRequestForm')[0]);

        for (let key of qaWritePage.fd.keys()) {
            if (qaWritePage.fd.get(key) === '') {
                alert(`Please enter ${key}`);
                return;
            }
        }
        const data = new URLSearchParams(qaWritePage.fd);
        qaWritePage.request(data);
    },
    request: async (data) => {
        try {
            let response = await fetch('/sub/qa/write', {
                method: 'POST',
                body: data,
            });
            let responseData = await response.json();
            if (responseData.success) {
                alert(responseData.message);
                window.location.href = '/sub/qa';
            } else {
                alert(response.message);
            }
        } catch (err) {
            console.error(new Error('error'));
        }
    },
};
