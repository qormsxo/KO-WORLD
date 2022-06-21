let language = {
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
let teamscore = {
    highTable: undefined,
    collegeTable: undefined,
    url: '/answer',
    tableOption: {
        processing: true,
        serverSide: true,
        searching: false,
        autoWidth: false,
        pagingType: 'full_numbers',
        responsive: true,
        lengthChange: false,
        // sDom: '<"top"if>rt<"bottom"p><"clear">',
        ajax: {
            url: '',
        },
        columns: [
            {
                data: 'USER_ID',
                // render: function (data, type, row) {
                //     return '<a href="#">' + row['QA_TITLE'] + '</a>';
                // },
            },
            {
                data: 'USER_NM',
                // render: function (data, type, row) {
                //     return '<i class="fa fa-pencil" style="margin-right: 10px" aria-hidden="true"></i>' + row['USER_NM'];
                // },
            },
            {
                data: 'BIRTHDAY',
                // render: function (data, type, row) {
                //     return '<i class="fa fa-clock-o" style="margin-right: 10px" aria-hidden="true"></i>' + row['REG_DTTM'];
                // },
            },
            {
                data: 'NATIONALITY',
                // render: function (data, type, row) {
                //     return '<i class="fa fa-eye" style="margin-right: 10px" aria-hidden="true"></i>' + row['QA_VWS'];
                // },
            },
            {
                data: 'EMAIL',
                // render: function (data, type, row) {
                //     let answerCompletion = '답변완료';
                //     let answerExpected = '답변예정';
                //     return row['QA_STS'] === 'YES' ? answerCompletion : answerExpected;
                // },
            },
            {
                data: 'isJug',
                render: function (data, type, row) {
                    if (data == 1) {
                        return '<a class="answer">answer</a>';
                    } else {
                        return 'answered';
                    }
                },
            },
            {
                data: 'isJug',
                render: function (data, type, row) {
                    if (data == 1) {
                        return `<a class="download">download</a>`;
                    } else {
                        return 'submitted';
                    }
                },
            },
            {
                data: 'ANS_SCORE',
                render: function (data, type, row) {
                    if (data != null && (data == 'Grading required' || data.slice(-1) == '>')) {
                        return data;
                    } else {
                        return `<input type="text"  style="width:50%;"  value= '${data == null ? '' : data}' class = "score-input" >`;
                    }
                },
            },
            {
                data: 'ranking',
                // render: function (data, type, row) {
                //     return `<input type="text" value= ${data} />`;
                // },
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
                targets: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                orderable: false,
            },
            // {
            //     targets: 1,
            //     orderable: false,
            //     className: 'text-left',
            // },
            // {
            //     targets: 2,
            //     orderable: false,
            //     className: 'text-left',
            // },
            // {
            //     targets: 3,
            //     orderable: false,
            // },
            // {
            //     targets: 4,
            //     orderable: false,
            //     className: 'text-left',
            // },
            // {
            //     targets: 5,
            //     orderable: false,
            // },
        ],
        order: [[8, 'asc']],
        paging: true, //paging 사용 여부
        scrollY: 200, //표 세로 사이즈
        scrollX: true,
        iDisplayLength: 10,
        language: language,
        drawCallback: function (settings) {
            //console.log(teamscore.tableOption.downloadType);
        },
    },
    highSchool: () => {
        teamscore.tableOption.ajax.url = teamscore.url + '?type=high';
        teamscore.highTable = $('#highTable').DataTable(teamscore.tableOption);
    },
    college: () => {
        teamscore.tableOption.ajax.url = teamscore.url + '?type=college';
        teamscore.collegeTable = $('#collegeTable').DataTable(teamscore.tableOption);
    },
    // 점수 매기기
    scoring: (score, user) => {
        const check = /^[0-9]+$/;
        if (!check.test(score)) {
            alert('Please enter a number only');
        } else {
            $.ajax({
                type: 'POST',
                url: '/answer/score',
                data: { score: score, user: user },
                success: function (response) {
                    if (response.status) {
                        teamscore.search()
                    }
                },
            });
        }
    },
    search: () => {
        let search_keyword = $('#search_keyword').val();
        let search_option = $('#select_option option:selected').val();
        let hisearch_url = teamscore.url + '?type=high&search_keyword=' + search_keyword + '&search_option=' + search_option;
        let cosearch_url = teamscore.url + '?type=college&search_keyword=' + search_keyword + '&search_option=' + search_option;
        teamscore.highTable.clear();
        teamscore.collegeTable.clear();
        teamscore.highTable.ajax.url(hisearch_url).draw();
        teamscore.collegeTable.ajax.url(cosearch_url).draw();
    },
};

$(function () {
    teamscore.highSchool();
    teamscore.college();
    // 파일 다운로드
    $(document).on('click', '.download', function () {
        let tr = $(this).parent().parent('tr');
        let id = tr.parent().attr('id');
        //console.log(id);
        let rowData;
        if (id == 'highSchool') {
            rowData = teamscore.highTable.row(tr).data();
        } else if (id == 'college') {
            rowData = teamscore.collegeTable.row(tr).data();
        } else {
            console.error('error');
        }
        window.location.href = `/answer/file?user=${rowData.USER_ID}`;
    });
    // 답 클릭시 모달 출력
    $(document).on('click', '.answer', function () {
        let tr = $(this).parent().parent('tr');
        let id = tr.parent().attr('id');
        let rowData;
        if (id == 'highSchool') {
            rowData = teamscore.highTable.row(tr).data();
        } else if (id == 'college') {
            rowData = teamscore.collegeTable.row(tr).data();
        } else {
            console.error('error');
        }

        $.ajax({
            type: 'get',
            url: '/answer/user',
            data: { user: rowData.USER_ID },
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
    // score input
    $(document).on('keyup', '.score-input', (e) => {
        $(e.target).val(
            $(e.target)
                .val()
                .replace(/[^0-9]$/g, '')
        );
        if ($(e.target).val() > 100) {
            $(e.target).val(100);
        }
        if (e.key == 'Enter') {
            let tr = $(e.target).parent().parent('tr');
            let id = tr.parent().attr('id');
            // console.log(id);
            let rowData;
            if (id == 'highSchool') {
                rowData = teamscore.highTable.row(tr).data();
            } else if (id == 'college') {
                rowData = teamscore.collegeTable.row(tr).data();
            } else {
                console.error('error');
            }
            teamscore.scoring($(e.target).val(), rowData.USER_ID);
        }
    });
    $('#search_keyword').on('keyup', (e) => {
        if (e.key == "Enter") {
            teamscore.search();
        }
    })
});
