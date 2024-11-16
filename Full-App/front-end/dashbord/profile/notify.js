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

function ShowNotification(time, sender, photo, name, content)
{
    
    
    const date = document.getElementById("notify-date")
    const description = document.getElementById("notify-description")
    const picture = document.getElementById("notify-image")
    const title = document.getElementById("notify-title")
    
    date.innerText = time
    description.innerHTML = `${content}<a id="notify-sender" href="http://">@${sender}</a> `
    picture.src = photo
    title.innerText = name

    const notification = document.getElementById("notification")
    notification.classList.remove("hidden")
}


async function initWebSocket() {
    try {
        const websocket = await OnPageConnection();

        websocket.onmessage = async function(event) {
            const server_message = JSON.parse(event.data);
            if (server_message['case'] === 'invitation')
            {
                let name = 'New Friend Request'
                let content = 'Request from :' 
                // full name kyn la bghiti tzido 'full-name'
                ShowNotification(server_message['time'], server_message['sender'], server_message['picture'], name, content)
            }
            console.log('[+] ', server_message);
        };

    } catch (error) {
        console.error('Failed to establish WebSocket connection:', error);
    }
}



document.getElementById("notify-close").addEventListener("click", function() {
    const main = document.getElementById("notification")
    main.classList.add("hidden")
})


initWebSocket();

