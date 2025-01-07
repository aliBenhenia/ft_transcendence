import axios from 'axios';

async function acceptRequest(username:any) {
    const token = localStorage.getItem('accessToken');
    const url = `http://127.0.0.1:9000/friends/new-request/${username}/accept`;

    try {
        const response = await axios.post(url, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Request accepted:', response.data);
    } catch (err) {
        console.log('Error accepting request:', err);
    }
}
export default acceptRequest;
