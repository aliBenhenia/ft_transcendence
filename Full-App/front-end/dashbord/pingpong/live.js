// Open Game Room for Live communication
async function RoomConnection(username)
{
    const token = localStorage.getItem('accessToken')
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(`ws://127.0.0.1:9000/pingpong/ws/live/${username}/?token=${token}`);

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

// Open Connection for lisining 
async function OnPageConnection() 
{
    const token = localStorage.getItem('accessToken')
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(`ws://127.0.0.1:9000/pingpong/ws/match/open-connection/?token=${token}`);

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

let second_user;

async function initWebSocket() 
{
    try 
    {
        const websocket = await OnPageConnection();
        websocket.onmessage = async function(event) 
        {
            const server_message = JSON.parse(event.data);
            recivedCommands(websocket, server_message)
        };
        FindPlayer(websocket)
    } 
    catch (error) 
    {
        console.error('Failed to establish WebSocket connection:', error);
    }
}

async function SendCommand(websocket, msg)
{
    websocket.send(JSON.stringify(msg));
}

async function SendPosition(room, msg)
{
    room.send(JSON.stringify(msg));
}

async function SendQuite(room, msg)
{
    room.send(JSON.stringify(msg));
}

function waitForSeconds(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

async function onCommunicate(websocket)
{
    let senderInput = document.getElementById("sender-message")
    
    senderInput.addEventListener('input', async function() {
        let value = senderInput.value;
        SendPosition(websocket, {command : 'position', message : value})
    });
}

function Cancel(websocket, second)
{
    document.getElementById('cancel').addEventListener('click', async function()
    {
        SendCommand(websocket, {command: 'cancel', sendback:second})
    })
}

async function recivedCommands(websocket, server_message)
{
    console.log('[+] ', server_message);

    let player = server_message['sender']

    if (server_message['command'] == 'invite' && server_message['sender'])
    {
        if (true)
        {
            SendCommand(websocket, {command: 'accept', sendback:server_message['sender']})
    
            const room = await RoomConnection(server_message['sender']);
            room.onmessage = async function(event) 
            {
                const room_message = JSON.parse(event.data);
        
                console.log('[room_message] ', room_message); 
            };
            QuiteTheGame(room)
            onCommunicate(websocket)
        }
        else
        {
            Cancel(websocket, server_message['sender'])
        }
    }
    if (server_message['command'] == 'accept' && server_message['sender'])
    {
        const room = await RoomConnection(server_message['sender']);
        room.onmessage = async function(event) 
        {
            const room_message = JSON.parse(event.data);
            
            console.log('[room_message] ', room_message); 
        };
        QuiteTheGame(room)
        onCommunicate(websocket)
    }
}

async function QuiteTheGame(room)
{

    document.getElementById("quite").addEventListener("click", function() {
        SendQuite(room, {command:'quite', message:'player quite the game'})

    })
}

async function FindPlayer(websocket)
{
    document.getElementById('find-button').addEventListener('click', async function()
    {
        const token = localStorage.getItem('accessToken');
        const invite = document.getElementById("player").value
        second_user = await AccountDetails(invite)
        if (second_user != undefined)
        {
            await SendCommand(websocket, {command: 'invite', sendto:second_user['username']})
            Cancel(websocket, second_user['username'])
        }
    })
}


initWebSocket();