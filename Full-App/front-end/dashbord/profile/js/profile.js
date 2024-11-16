function UpdateOTP(status, token)
{
    let object = {
        'status': status
    }
    let headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }
    axios.post('http://127.0.0.1:9000/users/otp-update/', object, headers)
    .then((response) => {
        console.log('status : ', response.status)
        console.log('data : ', response.data)
    })
    .catch((err) => {
        console.error('error : ', err)
    })
}

function StyleOTP(status, toggleButton)
{
    if (status === true) 
    {
        toggleButton.textContent = 'Disable';
        toggleButton.classList.remove('bg-blue-500', 'hover:bg-blue-600');
        toggleButton.classList.add('bg-red-500', 'hover:bg-red-600');
    } 
    else
    {
        toggleButton.textContent = 'Enable';
        toggleButton.classList.remove('bg-red-500', 'hover:bg-red-600');
        toggleButton.classList.add('bg-blue-500', 'hover:bg-blue-600');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('accessToken');

    if (!token) 
    {
        document.getElementById('message').textContent = 'No access token found. Please login again.';
        return;
    }

    fetch('http://127.0.0.1:9003/account/profile/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data)
        {
            data = data.informations
            console.log('[+] : ', data.full_name)
            document.getElementById('client-fname').textContent = data.full_name;
            document.getElementById('client-lname').textContent = '@' + data.username;
            document.getElementById('client-match').textContent = data.total_match;
            document.getElementById('client-win').textContent = data.win;
            document.getElementById('client-loss').textContent = data.loss;
            document.getElementById('client-level').textContent = data.level;
            document.getElementById('client-achev').textContent = data.achievements;
            document.getElementById('client-online').textContent = data.online;

            const profilePicture = document.getElementById('profilePicture');
            profilePicture.src = data.picture;
            const toggleButton = document.getElementById('toggleButton');
            StyleOTP(data.otp, toggleButton)

            toggleButton.addEventListener('click', () => 
            {
                if (data.otp)
                {
                    UpdateOTP(false, token)
                    StyleOTP(false, toggleButton)        
                } 
                else 
                {
                    UpdateOTP(true, token)
                    StyleOTP(true, toggleButton) 
                }
            });
        } 
        else 
        {
            document.getElementById('message').textContent = 'Failed to fetch profile';
        }
        console.log('-> ', data)
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('message').textContent = 'An error occurred while fetching the profile. Please try again.';
    });
});

function logout() 
{
    localStorage.clear()
    window.location.href = '/../../login/login.html'

}

function redirect(){
    window.location.href = '/../../dashbord/password-reset/password.html'
}

// Close popup
document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('popup').classList.add('hidden'); 
});

document.getElementById("update-profile").addEventListener('click', function (){
    window.location.href = '/../../dashbord/update-information/update.html'
})