function VerifyOTP()
{
    window.location.href = '../dashbord/profile/profile.html';
}

document.getElementById('loginForm').addEventListener('submit', function(event) 
{
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://127.0.0.1:9003/login/api/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        return response.json()
    })
    .then(data => {
        if (data.access && data.refresh) 
        {
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            VerifyOTP()
        } 
        else
            document.getElementById('message').textContent = 'Login failed';
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').textContent = 'An error occurred. Please try again.';
    });
});


document.getElementById("42-network").addEventListener('click', async function()
{
    try {
        const response = await axios.get(`http://127.0.0.1:9003/login/api/oauth/login/`);

        if (response.status == 200) 
        {
            console.log('[*]', response.data)
            console.log('[->]', response.data['autorize_link'])
            window.location.href = `${response.data['autorize_link']}`

            const response2 = await axios.get(response.data['autorize_link']);
            if (response2.status == 200)
            {
                console.log('[2]', response2.data)
                //localStorage.setItem('accessToken', response2.data.access);
                //localStorage.setItem('refreshToken', response2.data.refresh);
            }
            else
            {
                console.log('Error !')
            }
        }
        else
        {
            console.log('Server Error !')
        }
    }
    catch(e)
    {
        console.log('[+] ', e)
    }
}
)

