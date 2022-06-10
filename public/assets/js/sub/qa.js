// var language = {
//     emptyTable: '데이터가 없어요.',
//     lengthMenu: '페이지당 _MENU_ 개씩 보기',
//     info: '현재 _START_ - _END_ / _TOTAL_건',
//     infoEmpty: '데이터 없음',
//     infoFiltered: '( _MAX_건의 데이터에서 필터링됨 )',
//     search: '검색: ',
//     zeroRecords: '일치하는 데이터가 없어요.',
//     loadingRecords: '로딩중...',
//     processing: '잠시만 기다려 주세요...',
//     paginate: {
//         first: "<img src='/img/first.png' style='width:30px'>",
//         last: "<img src='/img/last.png' style='width:30px'>",
//         next: "<img src='/img/next.png' style='width:30px'>",
//         previous: "<img src='/img/prev.png' style='width:30px'>",
//     },
// };
// var job_posting_table_dts;
// // main 수행 함수
// var pagefunction = function () {
//     function job_posting_table() {
//         var table_option = {
//             processing: true,
//             serverSide: true,
//             searching: false,
//             autoWidth: false,
//             pagingType: 'full_numbers',
//             responsive: true,
//             lengthChange: false,
//             info: false,
//             // dom: "lftip",
//             ajax: {
//                 url: '/job_posting/get_table_list',
//             },
//             columns: [
//                 { data: 'job_posting_id' },
//                 {
//                     data: 'job_posting_type',
//                     render: function (data, type, row) {
//                         let posting_type = row['job_posting_type'];
//                         let posting_type_val;
//                         if (posting_type === '0') {
//                             posting_type_val = '신입';
//                         } else if (posting_type === '1') {
//                             posting_type_val = '경력';
//                         } else if (posting_type === '2') {
//                             posting_type_val = '신입/경력';
//                         }
//                         return "<p class='tag'>" + posting_type_val + '</p>';
//                     },
//                 },
//                 {
//                     data: null,
//                     render: function (data, type, row) {
//                         let posting_count = row['count'];
//                         if (posting_count != undefined) {
//                             $('#posting_count').text(posting_count + '개의 채용공고가 있습니다.');
//                         }

//                         let job_posting_title = row['job_posting_title'];

//                         let job_posting_type = row['job_posting_type'];
//                         if (job_posting_type === '1') job_posting_type = '경력';
//                         else if (job_posting_type === '0') job_posting_type = '신입';
//                         else if (job_posting_type === '2') job_posting_type = '신입+경력';

//                         let job_posting_status = row['job_posting_status'];
//                         if (job_posting_status === '1') job_posting_status = '채용중인 공고입니다.';
//                         else if (job_posting_status === '0') job_posting_status = '채용마감된 공고입니다.';
//                         else if (job_posting_status === '2') job_posting_status = '조기마감된 공고입니다.';

//                         let job_posting_job_status = row['job_posting_job_status'];
//                         if (job_posting_job_status === '1') job_posting_job_status = '정규직';
//                         else if (job_posting_job_status === '0') job_posting_job_status = '계약직';

//                         let job_posting_location = row['job_posting_location'];
//                         let deadline_date = row['deadline_date'];

//                         // return 0;
//                         return (
//                             "<div id='posting_info'>" +
//                             "<b class='row_posting_title'>" +
//                             job_posting_title +
//                             '</b>' +
//                             "<p class='sub'>" +
//                             '</p><ul>' +
//                             "<li class='type'>" +
//                             job_posting_job_status +
//                             '</li>' +
//                             "<li class='location'>" +
//                             job_posting_location +
//                             '</li>' +
//                             "<li class='dline'>~ " +
//                             deadline_date +
//                             '</li>' +
//                             "<li class='state txt-blue'><b>" +
//                             job_posting_status +
//                             '</b></li>' +
//                             '</ul>' +
//                             '<p></p>'
//                         );
//                         ('</div>');
//                     },
//                 },
//             ],
//             rowCallback: function (row, data, index) {
//                 $('.paginate_button ').removeClass('first last next prev');

//                 if (data.job_posting_status == '0' || data.job_posting_status == '2') {
//                     $(row).addClass('dead_posting');
//                 }
//             },
//             columnDefs: [
//                 {
//                     targets: 0,
//                     visible: false,
//                 },
//                 {
//                     targets: 1,
//                     className: 'text-center',
//                     orderable: false,
//                 },
//                 {
//                     targets: 2,
//                     className: 'text-left tb-title',
//                     orderable: false,
//                 },
//             ],
//             order: [[0, 'desc']],
//             paging: true, //paging 사용 여부
//             scrollY: 930, //표 세로 사이즈
//             scrollX: true,
//             iDisplayLength: 10,
//             language: language,
//             drawCallback: function (settings) {},
//         };
//         job_posting_table_dts = $('#job_posting_table').DataTable(table_option);
//     }

//     function fn_init() {
//         job_posting_table();
//     }

//     fn_init();
// };

// $('.posting_type').on('click', function () {
//     $('#posting_count').text('0개의 채용공고가 있습니다.');
//     $('.posting_type').removeClass('clicked');
//     $(this).addClass('clicked');
//     var posting_type = $(this).data('value');
//     var search_url = '/job_posting/get_table_list?search_keyword=' + posting_type;
//     job_posting_table_dts.clear();
//     job_posting_table_dts.ajax.url(search_url).draw(); //조회 된 data reflash
// });
// $('#job_posting_table').on('click', 'tbody tr', function () {
//     var row = $('#job_posting_table').DataTable().row(this).data();
//     row = row.job_posting_id;
//     location.href = '/job-posting/View?id=' + row;
// });

// pagefunction();

$('#qa_table').DataTable();
