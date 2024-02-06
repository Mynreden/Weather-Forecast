const user = localStorage.getItem("user");
if (user){
    const form = document.createElement('form');
    form.method = "get";
    form.action = '/main';
    const params = {user};
    for (const key in params) {
        if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = JSON.parse(params[key]);
        form.appendChild(hiddenField);
        }
    }
    document.body.appendChild(form);
    form.submit();
}

let loginForm = document.getElementById("loginForm")
let canLogin1 = false
let canLogin2 = false

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    let username = document.getElementById("usernameIn").value
    let password = document.getElementById("passwordIn").value

    const data = await fetch('http://localhost:3000/login', {
                method: 'POST',
                body: JSON.stringify({username, password}),
                headers: {
                    "Content-Type": "application/json",
                },

            })
            .then(response => response.json())
    if (!data.user){
        alert("incorrect password or username")
        return;
    }
    console.log(data)
    localStorage.setItem("user", JSON.stringify(data.user))
    window.location.replace("/main")
})

let signUpForm = document.getElementById("signUpForm")

signUpForm.addEventListener("submit", async (e) => { 
    e.preventDefault()
    if (canLogin1 == false || canLogin2 == false){
        return
    }
    let username = document.getElementById("username").value
    let password = document.getElementById("password").value

    const data = await fetch('http://localhost:3000/registration', {
        method: 'POST',
        body: JSON.stringify({username, password}),
        headers: {
            "Content-Type": "application/json",
        },

    })
    .then(response => response.json())
    if (!data.user){
        alert("incorrect password or username")
        return ;
    }
    console.log(data)
    localStorage.setItem("user", JSON.stringify(data.user))
    window.location.replace("/main")
})



function toogle() {
    sign_in = document.getElementById("sign_in")
    sign_up = document.getElementById("sign_up")

    if (sign_in.style.display === "none") {
        sign_in.style.display = "flex";
        sign_up.style.display = "none";
    } else {
        sign_in.style.display = "none";
        sign_up.style.display = "flex";
    }
    
}

function checkUsername() {
    username = document.getElementById("username").value
    checker = document.getElementById("usernameChecker")
    if (username.length < 5) {
        checker.innerHTML = "Username must be at least 5 characters long"
        return
    }
    else {
        checker.innerHTML = ""
        canLogin1 = true
    }
}

function checkPassword() {
    password = document.getElementById("password").value
    checker = document.getElementById("passwordChecker")
    if (password.length < 8) {
        checker.innerHTML = "Password must be at least 8 characters long"
        return
    }
    else if (!containInt(password)) {
        checker.innerHTML = "Password must contain at least one number"
        return
    }
    else {
        checker.innerHTML = ""
        canLogin2 = true
    }
}

let containInt = (str) => {
    for (let i = 0; i < str.length; i++) {
        if (str[i] >= '0' && str[i] <= '9') {
            return true
        }
    }
    return false
}
