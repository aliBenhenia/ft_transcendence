import axios from 'axios';

async function cancel(username:any) {
    const token = localStorage.getItem('accessToken');
    const url = `http://127.0.0.1:9000/friends/cancel/${username}/`;
    
    try {
        const response = await axios.post(url, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Cancellation successful:', response.data);
    } catch (err) {
        console.log('Error canceling request:', err);
    }
}
export default cancel;