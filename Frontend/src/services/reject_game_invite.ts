import axios from 'axios';
import { message } from 'antd';


const rejectGameInvite = (roomName) => async () => {
    const token = localStorage.getItem('accessToken'); 
    
    if (!token) {
        message.error('No authentication token found');
        console.error('No auth token found');
        return;
    }

    try {
       
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/chat/reject_game_invite/`,  
            { room_name: roomName }, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,  
                    'Content-Type': 'application/json',  
                }
            }
        );
        
        // Handle success
        console.log('Game invite rejected:', response.data);
        
        return response.data;  
    } catch (error) {
        
        if (error.response) {
            console.error('Error rejecting invite:', error.response.data);
            message.error(`Error rejecting game invite: ${error.response.data.error || 'Unknown error'}`);
        } else {
            console.error('Network error:', error.message);
            message.error(`Network error: ${error.message}`);
        }
    }
};

export default rejectGameInvite;
