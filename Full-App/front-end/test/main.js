const token = localStorage.getItem('accessToken')
const notificationSocket = new WebSocket(`ws://127.0.0.1:9003/ws/connection/?token=${token}`);

// Event handler for incoming messages
notificationSocket.onmessage = function(e) {
    try {
        const data = JSON.parse(e.data);
        console.log('[+] : ', data); // Use console.log for better visibility
      
    } catch (error) {
        console.error('Error parsing message:', error);
    }
};

// Event handler for when the WebSocket connection closes
notificationSocket.onclose = function(e) 
{
    console.error('Notification socket closed unexpectedly');
};

// Optional: Event handler for errors
notificationSocket.onerror = function(error) {
    console.error('WebSocket Error: ', error);
};

// Optional: Event handler for when the connection opens
notificationSocket.onopen = function(e) {
    console.log('WebSocket connection established');
};

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('send').addEventListener('click', function() {
        const data = {
            'reciver': 'areifoun',
            'command' : 'cancel',
            'message': 'hello there'
        };
        notificationSocket.send(JSON.stringify(data));
    });
});
