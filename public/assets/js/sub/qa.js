var language = {
    emptyTable: 'no data.',
    info: '<span>Total </span> <span style = "color : #D02B0B;">_TOTAL_</span><span>Q&A | Page</span> <span style = "color : #D02B0B;">_START_</span> <span>/ _END_</span>',
    infoEmpty: 'empty info',
    // infoFiltered: '( _MAX_건의 데이터에서 필터링됨 )',
    search: 'search: ',
    zeroRecords: 'no data.',
    loadingRecords: 'loading...',
    processing: 'wait minute...',
    // paginate: {
    //     first: "<img src='/img/first.png' style='width:30px'>",
    //     last: "<img src='/img/last.png' style='width:30px'>",
    //     next: "<img src='/img/next.png' style='width:30px'>",
    //     previous: "<img src='/img/prev.png' style='width:30px'>",
    // },
};
var myqa = undefined;
var qa_table;
// main 수행 함수
var pagefunction = function () {
    function qa_table_set() {
        var table_option = {
            processing: true,
            serverSide: true,
            searching: false,
            autoWidth: false,
            pagingType: 'full_numbers',
            responsive: true,
            lengthChange: false,
            stateSave: true,
            sDom: '<"top"if>rt<"bottom"p><"clear">',
            ajax: {
                url: '/api/qa_list',
            },
            columns: [
                { data: 'IDX' },
                {
                    data: 'QA_TITLE',
                    render: function (data, type, row) {
                        return '<a href="#">' + row['QA_TITLE'] + '</a>';
                    },
                },
                {
                    data: 'USER_NM',
                    render: function (data, type, row) {
                        return '<i class="fa fa-pencil" style="margin-right: 10px" aria-hidden="true"></i>' + row['USER_NM'];
                    },
                },
                {
                    data: 'REG_DTTM',
                    render: function (data, type, row) {
                        return '<i class="fa fa-clock-o" style="margin-right: 10px" aria-hidden="true"></i>' + row['REG_DTTM'];
                    },
                },
                {
                    data: 'QA_VWS',
                    render: function (data, type, row) {
                        return '<i class="fa fa-eye" style="margin-right: 10px" aria-hidden="true"></i>' + row['QA_VWS'];
                    },
                },
                {
                    data: 'QA_STS',
                    render: function (data, type, row) {
                        let answerCompletion = 'Answer complete';
                        let answerExpected = 'Answer pending';
                        return row['QA_STS'] === 'YES' ? answerCompletion : answerExpected;
                    },
                },
            ],
            rowCallback: function (row, data, index) {
                // $('.paginate_button ').removeClass('first last next prev');
                // if (data.job_posting_status == '0' || data.job_posting_status == '2') {
                //     $(row).addClass('dead_posting');
                // }
            },
            columnDefs: [
                {
                    targets: 0,
                    orderable: false,
                },
                {
                    targets: 1,
                    orderable: false,
                    className: 'text-left',
                },
                {
                    targets: 2,
                    orderable: false,
                    className: 'text-left',
                },
                {
                    targets: 3,
                    orderable: false,
                },
                {
                    targets: 4,
                    orderable: false,
                    className: 'text-left',
                },
                {
                    targets: 5,
                    orderable: false,
                },
            ],
            order: [[0, 'desc']],
            paging: true, //paging 사용 여부
            scrollY: 490, //표 세로 사이즈
            scrollX: true,
            iDisplayLength: 10,
            language: language,
            drawCallback: function (settings) {
                $('.text-left a').on('click', function () {
                    //현재 클릭된 Row(<tr>)
                    var tr = $(this).parent().parent();
                    var IDX = tr.children().eq(0).text();
                    $.ajax({
                        type: 'patch',
                        url: '/sub/qa/views',
                        data: { qaidx: IDX },
                        success: function (result) {
                            if (result.status === true) {
                                location.href = '/sub/qa/view?id=' + IDX;
                            } else {
                                alert('error');
                            }
                        },
                        error: function (a, b, c) {
                            alert(a + b + c);
                        },
                    });
                });
            },
        };
        qa_table = $('#qa_table').DataTable(table_option);
    }

    function fn_init() {
        qa_table_set();
    }

    fn_init();
};

$('#search_keyword').on('keyup', function (key) {
    if (key.keyCode == 13) {
        serarch();
    }
});

$('#myqa_btn').on('click', function () {
    myqa = true;
    $('#myqa_btn').hide();
    $('#total_btn').show();
    serarch();
});

$('#total_btn').on('click', function () {
    myqa = undefined;
    $('#myqa_btn').show();
    $('#total_btn').hide();
    serarch();
});

function serarch() {
    var search_keyword = $('#search_keyword').val();
    var search_option = $('#search_option').val();

    var search_url = '/api/qa_list?search_keyword=' + search_keyword + '&search_option=' + search_option + '&search_myqa=' + myqa;
    qa_table.clear();
    qa_table.ajax.url(search_url).draw(); //조회 된 data reflash
}

pagefunction();
