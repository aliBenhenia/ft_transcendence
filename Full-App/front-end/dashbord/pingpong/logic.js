let onGame;
let room_socket;
let websocket = undefined

let player_username = undefined;

let auth_user = undefined;
let second_user = undefined;




// Live Chat Flows in The Game Room
async function onCommunicate()
{
    let senderInput = document.getElementById("sender-message")
    
    senderInput.addEventListener('input', async function() {
        let value = senderInput.value;
        onGameStart({command : 'simple', message : value})

    });
}

onCommunicate()


// Show VS CARD of the Second Player (He)
function ShowVsPlayerInfo(RankValue, picture, profile_link, username, Matches, Win, Loss)
{
    const hideH2 = document.getElementById("afterhide")
    hideH2.classList.add("hidden")

    const vsPlayer = document.getElementById("card-id")
    vsPlayer.innerHTML = `
    <div>
    <h2 class="text-xl font-semibold" style="margin-bottom: 10px;">Player : </h2>
    <div class="flex items-center p-4 bg-white rounded-lg shadow-md">
    <div class="ml-4 text-center">
            <img src="${picture}" alt="User Image" class="w-12 h-12 rounded-full mx-auto">
            <a href="${profile_link}" class="text-lg font-semibold text-blue-600 hover:underline">${username}</a>
            <p class="text-sm text-gray-600">Rank: <span class="font-medium">${RankValue}</span></p>
            <p class="text-sm text-gray-600">Matches: <span class="font-medium">${Matches}</span></p>
            <p class="text-sm text-gray-600">Win: <span class="font-medium">${Win}</span></p>
            <p class="text-sm text-gray-600">Loss: <span class="font-medium">${Loss}</span></p>
        </div>
    </div>
    </div>
    `
}

// ON PAGE LOAD open a lisening socket
window.onload = async function()
{
    await ScanSession()
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

            // socket open for lisening
            room_socket = await OnPageConnection()

            auth_user = await AccountDetails(player_username)
            
            CurrentProfile(auth_user, player_username)

            // lisening on reciving any incoming commands
            room_socket.onmessage = async function(event)
            {
                const server_message = JSON.parse(event.data);

                console.log('[info] : ', event.data)
                if (server_message['command'] == 'invited' && server_message['sender'] != player_username)
                {
                    showPopup(server_message['sender'], server_message['token-invite'])
                }
                if (server_message['command'] == 'accepted')
                {
                    websocket = await RoomConnection(player_username, server_message['token-invite'], token)
                    onGameStart({command : 'simple', message : 'hello 1'})
                }
                if (server_message['command'] == 'quited')
                {
                    if (server_message['sender'] != player_username)
                    {
                        const sessionid = JSON.parse(sessionStorage.getItem('is_invited'))

                        PlayerQuted(sessionid['username'], sessionid['picture'])
                    }
                    sessionStorage.clear()
                    //AfterQuitGame()
                    Mood(false)
                }
            }
            
        } 
        else
            console.log("Status:", response.status);
    } 
    catch (e) 
    {
        console.log("[+] Error:", e);
    }
    //console.log('[ME] : ', player_username)
}

// Open Game Room for Live communication
async function RoomConnection(username, roomKey, token)
{
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(`ws://127.0.0.1:9000/pingpong/ws/live/${username}/${roomKey}/?token=${token}`);

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

// sending commands using the room for lisening
async function SendUsingSocketRoom(msg)
{
    room_socket.send(JSON.stringify(msg));
}

// on Game start reciving and sending
async function onGameStart(msg)
{
    if (websocket != undefined)
    {
        websocket.send(JSON.stringify(msg));
        websocket.onmessage = async function(event)
        {
            const server_message = JSON.parse(event.data);
            console.log('S : ', server_message['sender'], ' R : ' ,server_message['reciver'], ' M : ', server_message['message'])
        }
    }
}

// invite the plyer
async function FindPlayer()
{
    document.getElementById('find-button').addEventListener('click', async function()
    {
        const token = localStorage.getItem('accessToken');
        const invite = document.getElementById("player").value
        
        InvitePlayer(invite)
        // get player info (he)
        second_user = await AccountDetails(invite)


        SendUsingSocketRoom({command: 'invite', sendto:invite})

        room_socket.onmessage = async function(event)
        {
            const server_message = JSON.parse(event.data);

            if (server_message['command'] == 'accepted')
            {
                // get game token and open a communication in the target room
                const match_token = server_message['token-invite']
                console.log('[TOKEN] : ', match_token)

                websocket = await RoomConnection(second_user['username'], match_token, token)
                
                // set the token in the session storge so if page refrech you can use ScanSession function to stay connected 
                sessionStorage.setItem('token-invite', match_token)

                // keeps the plyer user name in the session storage so if page refrech you can use ScanSession function to stay connected and get the player info 
                sessionStorage.setItem('is_invited', JSON.stringify(second_user))

                
                const loadingSpinner = document.getElementById('loading-spinner');
                loadingSpinner.classList.remove('hidden');
                loadingSpinner.style.display = "none"
                
                Mood(true)
                ShowVsPlayerInfo("0", second_user['picture'], "#", '@' + invite, second_user['matches'], second_user['win'], second_user['loss'])
                
                // this msg after plyer accept (you can remove this line)
                onGameStart({command : 'simple', message : 'hello 2'})

            }
            if (server_message['command'] == 'quited' && server_message['sender'] != player_username)
            {

                const sessionid = JSON.parse(sessionStorage.getItem('is_invited'))
                PlayerQuted(sessionid['username'], sessionid['picture'])
                sessionStorage.clear()
                Mood(false)
            }
            console.log('[+] : Connection Establish with', invite)
            console.log('[+] : Recived Message ', server_message)
        }
    })
}

// loading spinner this is not importat just for : loading ......@player
function InvitePlayer(invite)
{
    
    const loadingSpinner = document.getElementById('loading-spinner');
    const playerInput = document.getElementById('player');
        

    const msg = document.getElementById('x-player');
    msg.innerText = "Invitation Sent !  Waiting for Approval : @" + invite 

    // Show loading spinner
    loadingSpinner.classList.remove('hidden');
    loadingSpinner.style.display = "flex"
        
    // Simulate processing delay
    setTimeout(() => {
        
        console.log('Processing invitation for player:', invite);
    
        loadingSpinner.classList.add('hidden');
        loadingSpinner.style.display = "none"
    }, 100000);
}

// this is important in case you refresh the page 
async function ScanSession()
{
    //token-invite
    // RoomConnection(username, roomKey, token)
    //
    const token = localStorage.getItem('accessToken');
    const live_game = localStorage.getItem('token-invite');
    const sessionid = JSON.parse(sessionStorage.getItem('is_invited'))

    if (sessionid)
    {
        console.log('[->>>] : ', sessionid.username)
    
        document.getElementById('popup').classList.remove('active');
        document.getElementById('overlay').classList.add('hidden');

        const loadingSpinner = document.getElementById('loading-spinner');
        loadingSpinner.classList.remove('hidden');
        loadingSpinner.style.display = "none"

        // return previos  connection if page refrech
        websocket = await RoomConnection(sessionid['username'], live_game, token)
        
        ShowVsPlayerInfo("0", sessionid['picture'], "#", '@' + sessionid['username'], sessionid['matches'], sessionid['win'], sessionid['loss'])
        
        Mood(true)
    }
}

// pop up that informs you that the player is out
function PlayerQuted(username, pict)
{
    document.getElementById('popup-quited').classList.add('active');
    document.getElementById('overlay1').classList.remove('hidden');

    const imgHolder = document.getElementById("senderpicture")
    imgHolder.src = pict

    const senderHolder = document.getElementById("senderusername")
    senderHolder.innerText = '@' + username + ' has Quited !'

    document.getElementById('accept1').addEventListener('click', async function() {

        document.getElementById('popup-quited').classList.remove('active');
        document.getElementById('overlay1').classList.add('hidden');
        AfterQuitGame()

    })
    document.getElementById('stay').addEventListener('click', async function() {

        document.getElementById('popup-quited').classList.remove('active');
        document.getElementById('overlay1').classList.add('hidden');

    })
}

// when reciving and invite show a pop up
async function showPopup(username, token_room) 
{
    second_user = await AccountDetails(username)

    document.getElementById('popup').classList.add('active');
    document.getElementById('overlay').classList.remove('hidden');

    const imgHolder = document.getElementById("sender-picture")
    imgHolder.src = second_user['picture']

    const senderHolder = document.getElementById("sender-username")
    senderHolder.innerText = '@' + username + ' has invited you to play !'


    document.getElementById('accept').addEventListener('click', async function() {
        
        // send accept command to inform the player also a token
        SendUsingSocketRoom({command: 'accepted', tokeninvite:token_room})

        document.getElementById('popup').classList.remove('active');
        document.getElementById('overlay').classList.add('hidden');

        const loadingSpinner = document.getElementById('loading-spinner');
        loadingSpinner.classList.remove('hidden');
        loadingSpinner.style.display = "none"

        ShowVsPlayerInfo("0", second_user['picture'], "#", '@' + second_user['username'], second_user['matches'], second_user['win'], second_user['loss'])
        
        // i did explain it go above 
        const current_session = sessionStorage.setItem('is_invited', JSON.stringify(second_user))
        sessionStorage.setItem('token-invite', token_room)

        const token = localStorage.getItem('accessToken');

        // open live connection for chating
        websocket = await RoomConnection(second_user['username'], token_room, token)

        Mood(true)

    });
    
    document.getElementById('cancel').addEventListener('click', function() {
        alert('Cancelled');
        document.getElementById('popup').classList.remove('active');
        document.getElementById('overlay').classList.add('hidden');
    });
}


// NOt important
function Mood(status)
{
    const mood = document.getElementById("which-mood")
    const Quit = document.getElementById("end-button")

    if (status == true)
    {
        mood.innerText = "ON"
        mood.classList.remove("text-red-600")
        mood.classList.add("text-green-600")
        Quit.classList.remove("hidden")
    }
    else
    {
        mood.innerText = "OFF"
        mood.classList.remove("text-green-600")
        mood.classList.add("text-red-600")
        Quit.classList.add("hidden")
    }
}

// reset cart vs player to the default
function AfterQuitGame()
{
    document.getElementById("card-id").innerHTML = `
    <h2 class="text-xl font-semibold" id="afterhide">Player:</h2>
  
        <div class="ml-2" id="change-mood">
            <p id="player-user" class="ml-2 text-lg text-gray-700"></p>
            <input id="player" type="text" required class="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
    <button id="find-button" type="button" class="ml-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition">Find</button>
    `
}

// if you quite clean session 
document.getElementById("end-button").addEventListener('click', function() {

    SendUsingSocketRoom({command: 'quited'})

    sessionStorage.clear()
    AfterQuitGame()
    Mood(false)

})

Mood(false)
FindPlayer()