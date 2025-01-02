import axios from 'axios';
import customAxios from './apiClient';
const FetchProfile = async (token: string|null) => {
    try {
        const res = await customAxios.get(`${process.env.NEXT_PUBLIC_API_URL}/account/profile/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });
    
        return res.data;  
    } catch (err: any) {
        
    }
};

export default FetchProfile;