let challenge = {
    // 참가자가 서버를 클릭했을때
    serverClick: (idx) => {
        //console.log(idx);
        fetch('/challenge/server', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idx: idx }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.possibility) {
                    window.location.href = response.address;
                } else {
                    console.log(response.message);
                    alert(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    },
    //문제 풀이 제출
    registerAnswer: () => {
        let fd = new FormData($('#answerForm')[0]); // 현재 form 데이터
        let data = new FormData(); // 새로운 form 데이터
        for (let key of fd.keys()) {
            // null 체크
            if (key.slice(0, -1) == 'answer' && !$(`#${key}`).val().trim()) {
                alert('Please enter answer');
                return;
            } else if (key.slice(0, -1) == 'file' && !$(`#${key}`).val()) {
                console.log(key);
                console.log($(`#${key}`).val());
                alert('Please attach the file');
                return;
            }

            if (key.slice(0, -1) == 'file') {
                // 파일
                data.append('answerFile', fd.get(key));
            } else {
                data.append(key, fd.get(key));
            }
            //console.log(`${key}:${fd.get(key)}`);
        }

        fetch('/challenge/answer', {
            method: 'POST',
            body: data,
        })
            .then((response) => response.json())
            .then((response) => {
                alert(response.message);
                window.location.href = '/';
            })
            .catch((error) => {
                console.error(error);
            });
    },
    // server 최대 인원 증감 함수
    currConSet: (obj, td) => {
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
                challenge.serverInfo();
            })
            .catch((error) => {
                console.error('아니 왜안됨?');
            });
    },
    // admin이 증감 이후에 실행하는 함수
    serverInfo: () => {
        let response = fetch('/challenge?' + new URLSearchParams({ admin: true }));
        const hosts = response.then((res) => res.json());
        hosts
            .then((response) => {
                let hosts = response.hosts;
                let tbody = '';
                for (var i = 0; i < hosts.length; i++) {
                    tbody += '<tr>';
                    for (var key in hosts[i]) {
                        tbody += `<td>${hosts[i][key]}</td>`;
                    }
                    tbody +=
                        ' <td>' +
                        '<input type="button" class="btn-sm btn-default btn" style="font-size: 17px;" value="+" />' +
                        '<input type="button" class="btn-sm btn-default btn" style="font-size: 17px;" value="-" />' +
                        '</td></tr>';
                }
                $('#serverTbody').children().remove();
                $('#serverTbody').append(tbody);
            })
            .catch((error) => {
                console.log(error);
            });
    },
};
$(function () {
    // 참가자가 서버 클릭
    $('.server').on('click', (event) => {
        console.log();
        if ($(event.target).hasClass('active')) {
            challenge.serverClick(event.target.value);
        }
    });
    // 관리자가 증감 버튼 클릭
    $(document).on('click', '.btn', (event) => {
        //console.log(event.target);
        const td = $(event.target).parent().parent().find('td').eq(0);
        const num = td.text();
        const val = $(event.target).val();
        challenge.currConSet({ idx: num, val: val }, td);
    });

    $('.file').hide();
    // 파일 이름 매핑
    $('.file').on('change', (e) => {
        let idx = $(e.target).attr('id').slice(-1);
        //console.log(idx);
        let fileValue = $(e.target).val().split('\\');
        let fileName = fileValue[fileValue.length - 1]; // 파일명
        //console.log(fileName);
        $(`#fileName${idx}`).attr('value', fileName);
    });
});
