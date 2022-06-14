let loginNullChk = () => {
    let fd = new FormData($('#loginForm')[0]);
    for (let key of fd.keys()) {
        if (fd.get(key) === '') {
            alert(`Please enter ${key}`);
            return false;
        }
    }

    return true;
};
