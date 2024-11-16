async function AccountDetails(username)
{
    const token = localStorage.getItem('accessToken')
    
    let headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.get(`http://127.0.0.1:9000/users/account-details/${username}/`, headers);

        if (response.status == 200) 
        {
            return response.data
        }
        else if (response.status == 404)
        {
            console.log('Account Not Found !')
            return undefined
        }
    }
    catch(e)
    {
        console.log('[+] ', e)
        return undefined
    }
}

async function CurrentProfile()
{
    const ImgUserAuth = document.getElementById("user-image")
    ImgUserAuth.src = auth_user['picture']
    
    const user_auth = document.getElementById("auth-user")
    user_auth.innerText = '@' + player_username

    const Rank = document.getElementById("rank")
    Rank.innerText = "0"

    const Matches = document.getElementById("matches")
    Matches.innerText = auth_user['matches']

    const Win = document.getElementById("win")
    Win.innerText = auth_user['win']
    
    const Loss = document.getElementById("loss")
    Loss.innerText = auth_user['loss']
}

let player_username;

window.onload = async function()
{
    const token = localStorage.getItem('accessToken')
    let headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    try {
        const response = await axios.get(`http://127.0.0.1:9000/users/find-me/`, headers);

        if (response.status === 200) 
        {
            player_username = response.data['username']
            auth_user = await AccountDetails(player_username)
            CurrentProfile(auth_user, player_username)
        }
    }
    catch(e)
    {
        console.log('authentication require !')
    }
}
