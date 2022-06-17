var language = {
    emptyTable: '데이터가 없어요.',
    lengthMenu: '페이지당 _MENU_ 개씩 보기',
    info: '<span>전체</span> <span style = "color : #D02B0B;">_TOTAL_</span><span>건 | 페이지</span> <span style = "color : #D02B0B;">_START_</span> <span>/ _END_</span>',
    infoEmpty: '데이터 없음',
    // infoFiltered: '( _MAX_건의 데이터에서 필터링됨 )',
    search: '검색: ',
    zeroRecords: '일치하는 데이터가 없어요.',
    loadingRecords: '로딩중...',
    processing: '잠시만 기다려 주세요...',
    // paginate: {
    //     first: "<img src='/img/first.png' style='width:30px'>",
    //     last: "<img src='/img/last.png' style='width:30px'>",
    //     next: "<img src='/img/next.png' style='width:30px'>",
    //     previous: "<img src='/img/prev.png' style='width:30px'>",
    // },
};
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
                        let answerCompletion = '답변완료';
                        let answerExpected = '답변예정';
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
                    // 현재 클릭된 Row(<tr>)
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

function serarch() {
    var search_keyword = $('#search_keyword').val();
    var search_option = $('#search_option').val();

    var search_url = '/api/qa_list?search_keyword=' + search_keyword + '&search_option=' + search_option;
    qa_table.clear();
    qa_table.ajax.url(search_url).draw(); //조회 된 data reflash
}

pagefunction();
