
function SendOrCancel(username, type)
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
        url = `http://127.0.0.1:9000/friends/request/${username}/true/`;
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

document.addEventListener("DOMContentLoaded", function() {

    const searchIn = document.getElementById('search-input');
    const suggest = document.getElementById('suggestions');

    searchIn.addEventListener('input', async function() {
        const value = this.value.toLowerCase();
        suggest.innerHTML = '';

        if (value) {
            let suggestList = await Search(value);
            console.log('[*] Targets : ', suggestList);

            if (suggestList.length > 0) {
                suggestList.forEach(function(suggestItem) 
                {
                    const div = document.createElement('div');
                    div.classList.add('p-2', 'border-b', 'border-gray-200', 'flex', 'items-center', 'justify-between');

                    const shrinkDiv = document.createElement('div');
                    shrinkDiv.classList.add('flex', 'items-center', 'space-x-2');

                    const spanUsers = document.createElement('a');
                    spanUsers.classList.add('text-gray-700', 'font-medium', 'text-sm');
                    spanUsers.textContent = suggestItem.username;
                    spanUsers.href = '../friends/user.html?=' + suggestItem.username

                    const imgUsers = document.createElement('img');
                    imgUsers.classList.add('w-8', 'h-8', 'rounded-full');
                    imgUsers.src = 'http://127.0.0.1:9000/users' + suggestItem.picture;

                    shrinkDiv.appendChild(imgUsers);
                    shrinkDiv.appendChild(spanUsers);

                    div.appendChild(shrinkDiv);


                    const buttonFriend = document.createElement('button');
                    //buttonFriend.classList.add('ml-2', 'px-3', 'py-1', 'bg-blue-500', 'text-white', 'rounded-md', 'hover:bg-blue-600');
                    if (suggestItem.is_friend === false && suggestItem.is_pending === false) 
                    {
                        if (suggestItem.requested)
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
                    else if (suggestItem.is_pending === true) 
                    {
                        buttonFriend.classList.add('ml-2', 'px-3', 'py-1', 'bg-red-500', 'text-white', 'rounded-md', 'hover:bg-red-600');
                        buttonFriend.textContent = 'Cancel';
                    } 
                    else if (suggestItem.is_friend == true)
                    {
                        buttonFriend.classList.add('ml-2', 'px-3', 'py-1', 'bg-red-500', 'text-white', 'rounded-md', 'hover:bg-red-600');
                        buttonFriend.textContent = 'Remove';
                    }
                    buttonFriend.addEventListener('click', function() {
                        console.log('[*] Request Target : ', suggestItem.username);
                        let option = buttonFriend.textContent;
                        if (option === 'Add Friend') 
                        {
                            SendOrCancel(suggestItem.username, true);
                            buttonFriend.classList.remove('ml-2', 'px-3', 'py-1', 'bg-blue-500', 'text-white', 'rounded-md', 'hover:bg-blue-600');
                            buttonFriend.classList.add('ml-2', 'px-3', 'py-1', 'bg-red-500', 'text-white', 'rounded-md', 'hover:bg-red-600');
                            buttonFriend.textContent = 'Cancel';
                        } 
                        else if (option === 'Cancel') 
                        {
                            SendOrCancel(suggestItem.username, false);
                            buttonFriend.classList.remove('ml-2', 'px-3', 'py-1', 'bg-red-500', 'text-white', 'rounded-md', 'hover:bg-red-600');
                            buttonFriend.classList.add('ml-2', 'px-3', 'py-1', 'bg-blue-500', 'text-white', 'rounded-md', 'hover:bg-blue-600');
                            buttonFriend.textContent = 'Add Friend';
                        }
                        else if (option === 'Accept')
                        {
                            AcceptOrCancel(suggestItem.username, true)
                            buttonFriend.classList.remove('ml-2', 'px-3', 'py-1', 'bg-green-500', 'text-white', 'rounded-md', 'hover:bg-green-600');
                            buttonFriend.classList.add('ml-2', 'px-3', 'py-1', 'bg-red-500', 'text-white', 'rounded-md', 'hover:bg-red-600');
                            buttonFriend.textContent = 'Remove';
                        }
                        else if (option === 'Remove')
                        {
                            FriendOperations(suggestItem.username, 1)
                            buttonFriend.classList.remove('ml-2', 'px-3', 'py-1', 'bg-red-500', 'text-white', 'rounded-md', 'hover:bg-red-600');
                            buttonFriend.classList.add('ml-2', 'px-3', 'py-1', 'bg-blue-500', 'text-white', 'rounded-md', 'hover:bg-blue-600');
                            buttonFriend.textContent = 'Add Friend';
                        }
                    });

                    div.appendChild(buttonFriend);
                    suggest.appendChild(div);
                });
                suggest.classList.remove('hidden');
            } else {
                suggest.classList.add('hidden');
            }
        } else {
            suggest.classList.add('hidden');
        }
    });
});
