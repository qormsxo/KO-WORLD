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
var user_list_table;
// main 수행 함수
var pagefunction = function () {
    function user_list_table_set() {
        var table_option = {
            processing: true,
            serverSide: true,
            searching: false,
            // autoWidth: false,
            pagingType: 'full_numbers',
            responsive: true,
            lengthChange: false,
            // stateSave: true,
            sDom: '<"top"if>rt<"bottom"p><"clear">',
            ajax: {
                url: '/api/committee_list',
            },
            columns: [
                { data: 'IDX' },
                { data: 'USER_ID' },
                { data: 'USER_NM' },
                { data: 'EMAIL' },
                { data: 'PERM_NM_KR' },
                // { data: 'PERM_NM_EN' },
                {
                    data: 'GRADE_NM_KR',
                    render: function (data, type, row) {
                        if (row['PERM_NM_KR'] === '위원회') {
                            let overseer = '';
                            let judge = '';
                            row['GRADE_NM_KR'] === '감독관' ? (overseer = 'selected') : (judge = 'selected');
                            return (
                                '<select id="committee_change_option" class="form-select committee_change_option" aria-label="Default select example"> ' +
                                '<option value="0000" ' +
                                overseer +
                                '>감독관</option> ' +
                                '<option value="0001" ' +
                                judge +
                                '>심사위원</option> ' +
                                '</select>'
                            );
                        } else {
                            return row['GRADE_NM_KR'];
                        }
                    },
                },
                // { data: 'GRADE_NM_EN' },
                { data: 'REG_DTTM' },
                {
                    data: 'ACCEPT',
                    render: function (data, type, row) {
                        var checked = row['ACCEPT'] === '1' ? 'checked' : '';
                        return (
                            '<div class="form-check form-switch">' +
                            '<input class="form-check-input user_accept_check" type="checkbox" role="switch" id="flexSwitchCheckDefault" ' +
                            checked +
                            '> ' +
                            '<label class="form-check-label user_accept_check" for="flexSwitchCheckDefault"></label> ' +
                            '</div>'
                        );
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
                    className: 'text-left',
                },
                {
                    targets: 6,
                },
                {
                    targets: 7,
                    orderable: false,
                },
            ],
            order: [[0, 'desc']],
            paging: true, //paging 사용 여부
            scrollY: 415, //표 세로 사이즈
            // scrollX: true,
            iDisplayLength: 10,
            language: language,
            drawCallback: function (settings) {
                $('.user_accept_check').on('change', function () {
                    var status;
                    status = $(this).prop('checked') ? true : false;
                    var tr = $(this).parent().parent().parent();
                    var IDX = tr.children().eq(0).text();
                    $.ajax({
                        type: 'patch',
                        url: '/user/accept',
                        data: { qaidx: IDX, status: status },
                        success: function (result) {
                            if (result.status === true) {
                                search();
                            } else {
                                alert('error');
                            }
                        },
                        error: function (a, b, c) {
                            alert(a + b + c);
                        },
                    });
                });

                $('.committee_change_option').on('change', function () {
                    var status = $(this).val();
                    var tr = $(this).parent().parent();
                    var IDX = tr.children().eq(0).text();
                    $.ajax({
                        type: 'patch',
                        url: '/user/committee/grade_code',
                        data: { qaidx: IDX, status: status },
                        success: function (result) {
                            if (result.status === true) {
                                search();
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
        user_list_table = $('#user_list_table').DataTable(table_option);
    }

    function fn_init() {
        user_list_table_set();
    }

    fn_init();
};

$('.search_user_perm').on('change', function (e) {
    search();
});

$('#search_keyword').on('keyup', function (e) {
    if (e.key == 'Enter') {
        search();
    }
});

function search() {
    var search_keyword = $('#search_keyword').val();
    var search_option = $('#select_option option:selected').val();
    var search_user_perm = $('input:radio[name="search_user_perm_option"]:checked').val();
    var search_url = '/api/committee_list?search_keyword=' + search_keyword + '&search_option=' + search_option + '&search_user_perm=' + search_user_perm;
    user_list_table.clear();
    user_list_table.ajax.url(search_url).draw();
}

pagefunction();
