/*
const token = localStorage.getItem('accessToken');
const ws = new WebSocket(`ws://127.0.0.1:9000/friends/ws/notification/ayrei/?token=${token}`);

ws.onopen = () => {
    ws.send(JSON.stringify({ message: 'Hello WebSocket!' }));
};

ws.onmessage = (event) => {
    console.log('Message from server', event.data);
};
*/