let websocket;

function SendUsingSocket(msg)
{
    websocket.send(JSON.stringify({ message: msg }));
}

document.getElementById('send').addEventListener('click', function(event) {
    
    const token = localStorage.getItem('accessToken');
    event.preventDefault();
    
    const userIn = document.getElementById("message-input");
    const msg = userIn.value;
    const message = new FormData();
    
    userIn.value = ""
    const send_to = document.getElementById("pannel-user").innerText;
    console.log('[>>>] : ', send_to)
    SendUsingSocket(msg);
    if (true) 
    {
        message.append('message', msg);
        axios.post(`http://127.0.0.1:9000/friends/chat/message/${send_to}/`, message, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 200) 
            {
                DisplayPannel(send_to);
            }
       })
    }
});

async function NewDiscuss()
{
    const token = localStorage.getItem('accessToken')
    const queryUrl  = new URL(window.location.href)
    const target = queryUrl.search.replace("?=", "")
    console.log('username : ', target)
    if (!target)
        return
    DisplayPannel(target)
    websocket = await OpenConnection(target, token)
}

NewDiscuss()


async function DisplayPannel(username)
{
    const token = localStorage.getItem('accessToken')
    let headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    let url = `http://127.0.0.1:9000/friends/chat/${username}/`;
    const response = await axios.get(url, headers);
    let usersArray = response.data['messages']

    let msgTo = document.getElementById('pannel-user')
    msgTo.textContent = username
    
    let remove = document.getElementById('messages-list')
    remove.innerHTML = ""
    usersArray.forEach(data =>
    {
        if (data.sender == 'me')
            Outgoing("me", data.date, data.textmessage, "http://127.0.0.1:9000/users" + data.picture)
        else
            Incoming(data.sender, data.date, data.textmessage, "http://127.0.0.1:9000/users" + data.picture)
    })
}


function LoadFriends(username, last_message, date, status, userimg)
{
    let objects;
    let container = document.getElementById("show-friends")

    let add1 = document.createElement('div')
    add1.classList.add('flex', 'items-center', 'mb-4', 'cursor-pointer', 'hover:bg-gray-100', 'p-2', 'rounded-md')
    add1.setAttribute('id', username)
    
    // Display : image and status
    
    let add2 = document.createElement('div')
    let img = document.createElement('img')
    let is_online = document.createElement('span')
    add2.classList.add('relative', 'w-12', 'h-12', 'bg-gray-300', 'rounded-full', 'mr-3')
    img.classList.add('w-12', 'h-12', 'rounded-full')
    img.setAttribute('alt', username)
    img.setAttribute('src', userimg)
    if (status == true)
        is_online.classList.add('absolute', 'bottom-0', 'left-0', 'w-3', 'h-3', 'bg-green-500', 'rounded-full', 'border-2', 'border-white')
    add2.append(img, is_online)
    
    
    // Display : username and last_message
    
    let add3 = document.createElement('div')
    add3.classList.add('flex-1')
    let user = document.createElement('h2')
    let message = document.createElement('p')
    user.classList.add('text-lg', 'font-semibold')
    user.textContent = username
    message.classList.add('text-gray-600')
    message.textContent = last_message
    add3.append(user, message)
    
    // Display : date and is seen
    
    let add4 = document.createElement('div')
    let message_date = document.createElement('p')
  
    message_date.setAttribute('style', "font-size: 8px;")
    message_date.textContent = date
    add4.append(message_date)
    
    add1.append(add2, add3, add4)
    container.append(add1)
    
}


async function BringFrirends(token) 
{
    let headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    let url = `http://127.0.0.1:9000/friends/chat/`;
    
    try 
    {
        const response = await axios.get(url, headers);
        let usersArray = response.data["friends"]
        
        return usersArray; 
    } 
    catch (err) 
    {
        console.error('error : ', err);
    }
}

async function OpenConnection(username, token) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(`ws://127.0.0.1:9000/friends/ws/notification/${username}/?token=${token}`);

        ws.onopen = () => {
            resolve(ws);

        };

        ws.onerror = (error) => {
            reject(new Error('WebSocket connection error: ' + error.message));  // Reject the promise on error
        };

        ws.onclose = (event) => {
            if (!event.wasClean) {
                reject(new Error('WebSocket connection closed unexpectedly'));
            }
        };
    });
}


window.onload = async function() {
    try {
        const token = localStorage.getItem('accessToken');
        const usersArray = await BringFrirends(token);

        console.log('user :', usersArray)

        usersArray.forEach(friend => {
            let picture = 'http://127.0.0.1:9000/users' + friend.picture;
            LoadFriends(
                friend['username'],
                friend['last-message'],
                friend['message-time'],
                friend['is-online'],
                picture
            );
            document.getElementById(friend['username']).addEventListener('click', async function() {
                DisplayPannel(friend['username']);
                websocket = await OpenConnection(friend['username'], token)
                websocket.onmessage = function(event) 
                {
                    const receivedData = JSON.parse(event.data);
                    console.log('Received message:', receivedData);
                    if (receivedData.sender == friend['username'])
                    {
                        Incoming(receivedData.sender, receivedData.time, receivedData.message, receivedData.picture);
                        //DisplayPannel(friend['username'])
                    }
                };
            });
        });
        
    } catch (error) {
        console.error('Error:', error);
    }
};

function Outgoing(username, date, message, picture) {
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('flex', 'justify-end', 'mb-4', 'cursor-pointer');

    const innerDiv = document.createElement('div');

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('flex', 'max-w-96', 'bg-indigo-500', 'text-white', 'rounded-lg', 'p-3', 'gap-3');

    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = message;

    messageDiv.appendChild(messageParagraph);
    innerDiv.appendChild(messageDiv);

    const dateDiv = document.createElement('div');
    dateDiv.style.display = 'flex';

    const usernameElement = document.createElement('p');
    usernameElement.style.paddingLeft = '5%';
    usernameElement.style.paddingTop = '2px';
    usernameElement.style.fontSize = '7px';
    usernameElement.style.color = 'gray';
    usernameElement.textContent = username;

    const dateElement = document.createElement('p');
    dateElement.style.fontSize = '7px';
    dateElement.style.color = 'gray';
    dateElement.style.paddingTop = '2px';
    dateElement.style.paddingLeft = '20%';
    dateElement.style.marginRight = 'auto';
    dateElement.textContent = date;

    dateDiv.appendChild(usernameElement);
    dateDiv.appendChild(dateElement);

    innerDiv.appendChild(dateDiv);

    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('w-9', 'h-9', 'rounded-full', 'flex', 'items-center', 'justify-center', 'ml-2');

    const imgElement = document.createElement('img');
    imgElement.src = picture;
    imgElement.alt = 'My Avatar';
    imgElement.classList.add('w-8', 'h-8', 'rounded-full');

    avatarDiv.appendChild(imgElement);

    mainDiv.appendChild(innerDiv);
    mainDiv.appendChild(avatarDiv);

    document.getElementById('messages-list').appendChild(mainDiv);
}


function Incoming(username, date, message, picture) 
{
    const mainDiv = document.createElement('div');
    mainDiv.classList.add('flex', 'mb-4', 'cursor-pointer');
    
    const avatarDiv = document.createElement('div');
    avatarDiv.classList.add('w-9', 'h-9', 'rounded-full', 'flex', 'items-center', 'justify-center', 'mr-2');
    
    const imgElement = document.createElement('img');
    imgElement.src = picture;
    imgElement.alt = 'Avatar Picture';
    imgElement.classList.add('w-8', 'h-8', 'rounded-full');
    
    avatarDiv.appendChild(imgElement);
    
    const contentDiv = document.createElement('div');
    
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('flex', 'max-w-96', 'bg-white', 'rounded-lg', 'p-3', 'gap-3');
    
    const messageParagraph = document.createElement('p');
    messageParagraph.classList.add('text-gray-700');
    messageParagraph.textContent = message; 
    
    messageDiv.appendChild(messageParagraph);
    
    const metaDataDiv = document.createElement('div');
    metaDataDiv.style.display = 'flex';
    
    const usernameParagraph = document.createElement('p');
    usernameParagraph.style.paddingLeft = '10%';
    usernameParagraph.style.paddingTop = '2px';
    usernameParagraph.style.fontSize = '7px';
    usernameParagraph.style.color = 'gray';
    usernameParagraph.textContent = username;  
    
    const dateParagraph = document.createElement('p');
    dateParagraph.style.padding = '2px 5px';
    dateParagraph.style.fontSize = '7px';
    dateParagraph.style.color = 'gray';
    dateParagraph.style.marginLeft = 'auto';  
    dateParagraph.textContent = date;  
    
    metaDataDiv.appendChild(usernameParagraph);
    metaDataDiv.appendChild(dateParagraph);
    
    contentDiv.appendChild(messageDiv);
    contentDiv.appendChild(metaDataDiv);
    
    mainDiv.appendChild(avatarDiv);
    mainDiv.appendChild(contentDiv);
    
    document.getElementById('messages-list').appendChild(mainDiv);
}
