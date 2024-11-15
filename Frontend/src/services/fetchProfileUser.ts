import axios from 'axios';

const FetchProfileUser = async (token:any, username:any) => {

    const url = `http://127.0.0.1:9003/account/search/?username=${username}`;
    
    const headers = {
        'Authorization': `Bearer ${token}`
    };

    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error:any) {
        if (error.response) {
                console.log("=====>",error.response)
        }

    }
};

export default FetchProfileUser;