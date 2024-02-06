const user = localStorage.getItem("user");
console.log(user)
if (user){
    if (user.isAdmin){
        const form = document.createElement('form');
        form.method = "get";
        form.action = '/adminpanel';
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
}

let loginForm = document.getElementById("loginForm")
let canLogin1 = false
let canLogin2 = false

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    let username = document.getElementById("usernameIn").value
    let password = document.getElementById("passwordIn").value

    const data = await fetch('/admin/login', {
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
    location.replace("/adminpanel")
})

