import axios from 'axios';

const getFriendListUser = async (token:any, username:any) => {

    const url = `http://127.0.0.1:9003/account/search/?username=${username}`;
    
    const headers = {
        'Authorization': `Bearer ${token}`
    };

    try {
        const response = await axios.get(url, { headers });
        return response.data.details.friends;
    } catch (error:any) {
        console.log("err++>",error);
        if (error.response) {
            if (error.response.status === 400 || error.response.status === 404) {
                console.log("=====>",error.response)
            }
        }
    
    }
};

export default getFriendListUser;