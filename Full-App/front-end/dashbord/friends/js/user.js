const newURL = new URL(window.location.href)
const queryValue = newURL.search.replace("?=", "")

console.log('[+]', queryValue)

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

async function DisplayUser()
{
    const img = document.getElementById("image")
    const rank = document.getElementById("rank")
    const fullname = document.getElementById("fullname")
    const match = document.getElementById("match")
    const wins = document.getElementById("wins")
    const loss = document.getElementById("loss")
    const username = document.getElementById("username")

    auth_user = await AccountDetails(queryValue)

    img.src = auth_user['picture']
    username.innerText =  '@' + queryValue
    wins.innerText = auth_user['win']
    loss.innerText = auth_user['loss']
    match.innerText = auth_user['matches']
    fullname.innerText = auth_user['full_name']
}

DisplayUser()

async function Search(queryKey) 
{
    const token = localStorage.getItem('accessToken');
    let headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    let url = `http://127.0.0.1:9000/friends/list/${queryKey}/`;

    try 
    {
        const response = await axios.get(url, headers);
        let usersArray = response.data['message']['users'];
        return usersArray; 
    } 
    catch (err) 
    {
        console.error('error : ', err);
    }
}

function AcceptOrCancel(username, type)
{
    const token = localStorage.getItem('accessToken');
    let headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    let url
    if (type === true)
        url = `http://127.0.0.1:9000/friends/new-request/${username}/true/`;
    else
        url = `http://127.0.0.1:9000/friends/new-request/${username}/false/`;
    try 
    {
        const response = axios.post(url, {} ,headers);
    } 
    catch (err) 
    {
        console.error('error : ', err);
    }
}

function FriendOperations(username, type)
{
    const token = localStorage.getItem('accessToken');
    let headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    let url
    if (type === 1)
        url = `http://127.0.0.1:9000/friends/new-request/${username}/remove/`;
    try 
    {
        const response = axios.post(url, {} ,headers);
    } 
    catch (err) 
    {
        console.error('error : ', err);
    }
}

const websocket = OnPageConnection()

async function OnPageConnection() 
{
    const token = localStorage.getItem('accessToken')
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(`ws://127.0.0.1:9000/account/ws/open-connection/?token=${token}`);

        ws.onopen = () => {
            resolve(ws);
        };

        ws.onerror = (error) => {
            reject(new Error('WebSocket connection error: ' + error.message));
        };

        ws.onclose = (event) => {
            if (!event.wasClean) {
                reject(new Error('WebSocket connection closed unexpectedly'));
            }
        };
    });
}


async function SendOrCancel(username, type)
{
    const token = localStorage.getItem('accessToken');
    let headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    if (type === true)
    {
        let ws = await websocket;
        ws.send(JSON.stringify({command: 'send-invitation-to', receiver: username}));
        
        url = `http://127.0.0.1:9000/friends/request/${username}/true/`;
    }
    else
        url = `http://127.0.0.1:9000/friends/request/${username}/false/`;
    try 
    {
        const response = axios.post(url, {} ,headers);
    } 
    catch (err) 
    {
        console.error('error : ', err);
    }
}

function TypeFriendship(userAccount)
{
    console.log('[info] : ', userAccount)
    const container = document.getElementById('friend-status')
    const buttonFriend = document.createElement('button');
    if (userAccount.is_friend === false && userAccount.is_pending === false)
    {
        if (userAccount.requested)
        {
            buttonFriend.classList.add('ml-2', 'px-3', 'py-1', 'bg-green-500', 'text-white', 'rounded-md', 'hover:bg-green-600');
            buttonFriend.textContent = 'Accept';
        }
        else
        {
            buttonFriend.classList.add('ml-2', 'px-3', 'py-1', 'bg-blue-500', 'text-white', 'rounded-md', 'hover:bg-blue-600');
            buttonFriend.textContent = 'Add Friend';
        }
    } 
    else if (userAccount.is_pending === true) 
    {
        buttonFriend.classList.add('ml-2', 'px-3', 'py-1', 'bg-red-500', 'text-white', 'rounded-md', 'hover:bg-red-600');
        buttonFriend.textContent = 'Cancel';
    } 
    else if (userAccount.is_friend == true)
    {
        buttonFriend.classList.add('ml-2', 'px-3', 'py-1', 'bg-red-500', 'text-white', 'rounded-md', 'hover:bg-red-600');
        buttonFriend.textContent = 'Remove';
        
        let chatDiv = document.createElement('a');
        chatDiv.href = "../chat/chat.html?=" + userAccount.username
        chatDiv.classList.add('bg-green-500', 'text-white', 'px-4', 'py-2', 'rounded-full', 'hover:bg-green-700')

        chatDiv.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h5m7 4h-7m-5 4H5.5a1.5 1.5 0 01-1.5-1.5v-11A1.5 1.5 0 015.5 6H19.5a1.5 1.5 0 011.5 1.5v7a1.5 1.5 0 01-1.5 1.5H8"/>
            </svg> Chat`
    
        container.appendChild(buttonFriend);
        container.appendChild(chatDiv);
    }


    buttonFriend.addEventListener('click', function() {

        let option = buttonFriend.textContent;
        if (option === 'Add Friend') 
        {
            SendOrCancel(userAccount.username, true);
            buttonFriend.classList.remove('ml-2', 'px-3', 'py-1', 'bg-blue-500', 'text-white', 'rounded-md', 'hover:bg-blue-600');
            buttonFriend.classList.add('ml-2', 'px-3', 'py-1', 'bg-red-500', 'text-white', 'rounded-md', 'hover:bg-red-600');
            buttonFriend.textContent = 'Cancel';
        } 
        else if (option === 'Cancel') 
        {
            SendOrCancel(userAccount.username, false);
            buttonFriend.classList.remove('ml-2', 'px-3', 'py-1', 'bg-red-500', 'text-white', 'rounded-md', 'hover:bg-red-600');
            buttonFriend.classList.add('ml-2', 'px-3', 'py-1', 'bg-blue-500', 'text-white', 'rounded-md', 'hover:bg-blue-600');
            buttonFriend.textContent = 'Add Friend';
        }
        else if (option === 'Accept')
        {
            AcceptOrCancel(userAccount.username, true)
            buttonFriend.classList.remove('ml-2', 'px-3', 'py-1', 'bg-green-500', 'text-white', 'rounded-md', 'hover:bg-green-600');
            buttonFriend.classList.add('ml-2', 'px-3', 'py-1', 'bg-red-500', 'text-white', 'rounded-md', 'hover:bg-red-600');
            buttonFriend.textContent = 'Remove';
        }
        else if (option === 'Remove')
        {
            FriendOperations(userAccount.username, 1)
            buttonFriend.classList.remove('ml-2', 'px-3', 'py-1', 'bg-red-500', 'text-white', 'rounded-md', 'hover:bg-red-600');
            buttonFriend.classList.add('ml-2', 'px-3', 'py-1', 'bg-blue-500', 'text-white', 'rounded-md', 'hover:bg-blue-600');
            buttonFriend.textContent = 'Add Friend';
        }
    });

    buttonFriend.style.marginLeft = "0px"
    const div = document.createElement('div');
    div.classList.add('p-2', 'border-b', 'border-gray-200', 'flex', 'items-center', 'justify-between');
    container.appendChild(buttonFriend);

}

async function Friends()
{
    let userChecking = undefined
    let suggestList = await Search(queryValue);
    for (obj in suggestList)
    {
        if (suggestList[obj].username === queryValue)
            userChecking = suggestList[obj]
    }
    if (userChecking != undefined)
    {
        console.log('[*] : ', userChecking.username);
        TypeFriendship(userChecking)
    }
}


Friends()


