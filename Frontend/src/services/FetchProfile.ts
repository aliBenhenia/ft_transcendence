import axios from 'axios';
import customAxios from './apiClient';
const FetchProfile = async (token: string|null) => {
    try {
        const res = await customAxios.get('http://127.0.0.1:9003/account/profile/', {
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