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

let challengeServer = {
    serverTable: undefined,
    tableOption: {
        processing: true,
        serverSide: true,
        searching: false,
        autoWidth: false,
        pagingType: 'full_numbers',
        responsive: true,
        lengthChange: false,
        stateSave: true,
        // sDom: '<"top"if>rt<"bottom"p><"clear">',
        ajax: {
            url: '/challenge/administrator',
        },
        columns: [
            {
                data: 'IDX',
            },
            {
                data: 'HOST_NM_KR',
            },
            {
                data: 'HOST_NM_EN',
            },
            {
                data: 'HOST_ADDR',
                render: function (data, type, row) {
                    return `<input type="text"  style="width:70%;"  value= '${data == null ? '' : data}' class = "score-input"/> `;
                },
            },
            {
                data: 'CURR_CON',
            },
            {
                data: 'MAX_CON',
            },
            {
                data: 'null',
                render: function (data, type, row) {
                    return (
                        '<input type="button" class="btn-sm btn-default btn" style="font-size: 17px;" value="+" />' +
                        '<input type="button" class="btn-sm btn-default btn" style="font-size: 17px;" value="-" />'
                    );
                },
            },
            {
                data: 'ENABLE',
                render: function (data, type, row) {
                    var checked = data === 1 ? 'checked' : '';
                    return (
                        '<div class="form-check form-switch">' +
                        `<input class="form-check-input " type="checkbox" role="switch" id="flexSwitchCheckDefault" ${checked} > ` +
                        '<label class="form-check-label" for="flexSwitchCheckDefault"></label> ' +
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
                targets: [0, 1, 2, 3, 4, 5, 6, 7],
                orderable: false,
            },
        ],
        order: [[0, 'asc']],
        paging: true, //paging 사용 여부
        scrollY: 600, //표 세로 사이즈
        scrollX: true,
        iDisplayLength: 10,
        language: language,
        drawCallback: function (settings) {
            $('.form-check-input').on('change', function () {
                const status = $(this).prop('checked') ? true : false;
                const tr = $(this).parent().parent().parent('tr');
                const IDX = challengeServer.serverTable.row(tr).data().IDX;
                //console.log(IDX, status);
                $.ajax({
                    type: 'put',
                    url: '/challenge/server/enable',
                    data: { idx: IDX, status: status },
                    success: function (result) {
                        // challengeServer.serverTable.clear();
                        // challengeServer.serverTable.ajax.url('/challenge/administrator').draw();
                    },
                    error: function (a, b, c) {
                        alert(a + b + c);
                    },
                });
            });
            $('.score-input').on('keyup', (e) => {
                if (e.key == 'Enter') {
                    let tr = $(e.target).parent().parent('tr');
                    // console.log(id);
                    let rowData = challengeServer.serverTable.row(tr).data();

                    challengeServer.changeUrl($(e.target).val(), rowData.IDX);
                }
            });
        },
    },
    table: () => {
        challengeServer.serverTable = $('#serverTable').DataTable(challengeServer.tableOption);
    },
    changeUrl: (url, idx) => {
        $.ajax({
            type: 'put',
            url: '/challenge/server/url',
            data: { url: url, idx: idx },
            success: function (response) {
                challengeServer.serverTable.clear();
                challengeServer.serverTable.ajax.url('/challenge/administrator').draw();
            },
            error: function (a, b, c) {
                alert(a, b, c);
            },
        });
    },
    // server 최대 인원 증감 함수
    currConSet: (obj) => {
        fetch('/challenge/server/curr-con', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        })
            .then((response) => response.json())
            .then((response) => {
                //console.log(response);
                // challengeServer.serverTable.clear();
                challengeServer.serverTable.ajax.url('/challenge/administrator').draw();
            })
            .catch((error) => {
                console.error('error');
            });
    },
};

$(function () {
    challengeServer.table();
    // 관리자가 증감 버튼 클릭
    $(document).on('click', '.btn', (event) => {
        //console.log(event.target);
        const tr = $(event.target).parent().parent('tr');
        let rowData = challengeServer.serverTable.row(tr).data();
        const num = rowData.IDX;
        const val = $(event.target).val();
        challengeServer.currConSet({ idx: num, val: val });
    });
});
