import axios from 'axios';

async function sendFriendRequest(username: string) {
    const token = localStorage.getItem('accessToken'); // Fetch token from localStorage

    if (!token) {
        // $1.log('No token found');
        return;
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const url = `http://127.0.0.1:9000/friends/request/${username}/true/`; // Hardcoded to 'send'

    try {
        const response = await axios.post(url, {}, { headers });
        return response.data; // Return the response data if needed
    } catch (err) {
        // $1.log('Error:', err);
    }
}
export default sendFriendRequest;