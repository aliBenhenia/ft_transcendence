import axios from 'axios';
import {message} from 'antd';
async function acceptGameInvite(roomName:any) {
    const token = localStorage.getItem('accessToken'); // Assuming the token is stored in localStorage
    if (!token) {
        // $1.error('No auth token found');
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

        // $1.log('Game invite accepted:', response.data);
        // Handle successful acceptance, such as showing a message or redirecting

    } catch (error:any) {
        if (error.response) {
            // $1.error('Error accepting invite:', error.response.data.error);
        } else {
            // $1.error('Network error:', error.message);
        }
        // Handle error
    }
}


export default acceptGameInvite;