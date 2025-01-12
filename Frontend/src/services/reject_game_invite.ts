import axios from 'axios';
import { message } from 'antd';


const rejectGameInvite = async (roomName:any)  => {
    const token = localStorage.getItem('accessToken'); 
    
    if (!token) {
        message.error('No authentication token found');
        // $1.error('No auth token found');
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
        // $1.log('Game invite rejected:', response.data);
        
        return response.data;  
    } catch (error:any) {
        
        if (error.response) {
            // $1.error('Error rejecting invite:', error.response.data);
            message.error(`Error rejecting game invite: ${error.response.data.error || 'Unknown error'}`);
        } else {
            // $1.error('Network error:', error.message);
            message.error(`Network error: ${error.message}`);
        }
    }
};

export default rejectGameInvite;
