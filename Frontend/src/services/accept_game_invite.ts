import axios from 'axios';
import {message} from 'antd';
async function acceptGameInvite(roomName) {
    const token = localStorage.getItem('accessToken'); // Assuming the token is stored in localStorage
    if (!token) {
        console.error('No auth token found');
        return;
    }

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/accept_game_invite/`, 
            { room_name: roomName },
            {
                headers: {
                    'Authorization': `Bearer ${token}`, // Attach token in Authorization header
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log('Game invite accepted:', response.data);
        // Handle successful acceptance, such as showing a message or redirecting

    } catch (error) {
        if (error.response) {
            console.error('Error accepting invite:', error.response.data.error);
        } else {
            console.error('Network error:', error.message);
        }
        // Handle error
    }
}


export default acceptGameInvite;