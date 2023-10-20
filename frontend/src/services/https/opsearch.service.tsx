const apiUrl = "http://localhost:8080";

  
// GET Worker
async function GetUserHWU() {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };

    let res = await fetch(`${apiUrl}/getuser`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            console.log(res);
            if (res.user) {
                return res.user;
            } else {
                return false;
            }
        });

    return res;
}

// Search Worker
async function SearchUser(key: String) {
    key = key.trim();
    if (key == "") {
        key = "ASd3kfds#23fghs5yege4tv4tq4tq34t"
    }
    const requestOptions = {
        method: "GET"
    };


    let res = await fetch(`${apiUrl}/searchuser/${key}`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            if (res.user) {

                return res.user;
            } else {
                return false;
            }
        });

    return res;
}

export {
    GetUserHWU,
    SearchUser,
};