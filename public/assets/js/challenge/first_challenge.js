let challenge = {
    serverInfo: () => {
        let response = fetch('/challenge?' + new URLSearchParams({ admin: true }));
        const hosts = response.then((res) => res.json());
        hosts.then((response) => {
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
        });
    },
    serverClick: (idx) => {
        console.log(idx);
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
                    window.location.href = 'https://www.google.com/';
                } else {
                    console.log(response.message);
                    alert(response.message);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    },
    registerAnswer: () => {
        let fd = new FormData($('.all-forms').find('form')[0]);

        for (let key of fd.keys()) {
            console.log(`${key}:${fd.get(key)}`);
        }

        // fetch('/', {
        //     method: 'POST',
        //     body: ""
        // })
        //     .then((response) => response.json())
        //     .then((response) => {
        //         // if (response) {
        //         // }
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //     });
    },
    maxConSet: (obj, td) => {
        fetch('/challenge/server/max-con', {
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
};
$(function () {
    $('.server').on('click', (event) => {
        console.log();
        if ($(event.target).hasClass('active')) {
            challenge.serverClick(event.target.value);
        }
    });
    $(document).on('click', '.btn', (event) => {
        //console.log(event.target);
        const td = $(event.target).parent().parent().find('td').eq(0);
        const num = td.text();
        const val = $(event.target).val();
        challenge.maxConSet({ idx: num, val: val }, td);
    });
});
