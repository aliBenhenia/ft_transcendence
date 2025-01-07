import axios from 'axios';

async function cancelRequest(username:string) {
    const token = localStorage.getItem('accessToken');
    const url = `http://127.0.0.1:9000/friends/new-request/${username}/cancel`;

    try {
        const response = await axios.post(url, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Request canceled:', response.data);
    } catch (err) {
        console.log('Error canceling request:', err);
    }
}

export default cancelRequest;