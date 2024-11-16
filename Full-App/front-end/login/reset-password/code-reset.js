document.getElementById('verification').addEventListener('click', function(event) {
    event.preventDefault();

    const formData = new FormData();
    const code = document.getElementById('code').value;

    formData.append('code', code);

    let username = sessionStorage.getItem('username')
    axios.post(`http://127.0.0.1:9000/users/rest-password/check/${username}/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
    .then(response => {

        console.log('[message]: ', response.data['message'])
        const hide = document.getElementById("error-message")
        const message =  document.getElementById("success-message")
        message.textContent = response.data['message']
        message.style.visibility = "visible";
        hide.style.visibility = "hidden";

        sessionStorage.clear();
        if (response.data['access'] && response.data['refresh']) 
        {
            localStorage.setItem('accessToken', response.data['access']);
            localStorage.setItem('refreshToken', response.data['refresh']);
        }
        setTimeout(() => {
            window.location.href = 'reset.html';
        }, 2000);
    })
    .catch(error => {

        console.log('[!] [message]: ',  error.response.data['message'])
        const hide =  document.getElementById("success-message")
        const message = document.getElementById("error-message")
        message.textContent = error.response.data['message']
        message.style.visibility = "visible";
        hide.style.visibility = "hidden";
    });
});


async function RequestCode(value) {
    try {
        const response = await axios.get(`http://127.0.0.1:9000/users/rest-password/send/${value}/`);

        if (response.status === 200) 
        {    
            console.log('[200] [message]: ', response.data['message'])
            const hide = document.getElementById("error-message")
            const message =  document.getElementById("success-message")
            message.textContent = response.data['message']
            message.style.visibility = "visible";
            hide.style.visibility = "hidden";
        } 
        else
        {
            console.log("Status:", response.status);
            console.log('[!] [message]: ', response.data['message'])
            const hide =  document.getElementById("success-message")
            const message = document.getElementById("error-message")
            message.textContent = response.data['message']
            message.style.visibility = "visible";
            hide.style.visibility = "hidden";
        }
    } 
    catch (e) 
    {
        const hide =  document.getElementById("success-message")
        hide.style.visibility = "hidden";

        const message = document.getElementById("error-message")
        message.style.visibility = "visible";
        console.log("[+] Error:", e.response.data['message']);
        message.textContent = e.response.data['message']

    }
}

async function ResendCode(username)
{
    const sucess =  document.getElementById("success-message")
    const error =  document.getElementById("error-message")
    
    sucess.textContent = ""
    error.textContent = ""
    
    sucess.style.visibility = "hidden";
    error.style.visibility = "hidden";
    
    RequestCode(username)
}

document.getElementById("resend").addEventListener("click", async function(event) {
    event.preventDefault();
    let username = sessionStorage.getItem('username')
    await ResendCode(username)
})

window.onload = async function()
{
    let username = sessionStorage.getItem('username')
    let state = (sessionStorage.getItem('state') === 'true')
    
    if (state != true)
    {
        RequestCode(username)
        sessionStorage.setItem('state', true)
    }
}

