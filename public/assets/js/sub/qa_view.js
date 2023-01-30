var IDX = $('#IDX').val();
let qaViewPage = {
    qaAnswerPageMove: () => {
        location.href = '/sub/qa/answer?id=' + IDX;
    },
    qaAnswerModifyPageMove: () => {
        location.href = '/sub/qa/answer/modify?id=' + IDX;
    },
    qaDelete: () => {
        var result = confirm('Are you sure you want to delete this question?');
        if (result) {
            $.ajax({
                type: 'delete',
                url: '/sub/qa/' + IDX,
                success: function (result) {
                    if (result.status === true) {
                        alert(result.message);
                        location.href = '/sub/qa';
                    } else {
                        alert('error');
                    }
                },
                error: function (a, b, c) {
                    alert(a + b + c);
                },
            });
        } else {
        }
    },
};
