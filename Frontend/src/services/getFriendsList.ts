import axios from 'axios';

const getFriendListUser = async (token:any, username:any) => {

    const url = `${process.env.NEXT_PUBLIC_API_URL}/account/search/?username=${username}`;
    
    const headers = {
        'Authorization': `Bearer ${token}`
    };

    try {
        const response = await axios.get(url, { headers });
        return response.data.details?.friends;
    } catch (error:any) {
        // $1.log("err++>",error);
        if (error.response) {
            if (error.response.status === 400 || error.response.status === 404) {
                // $1.log("=====>",error.response)
            }
        }
    
    }
};

export default getFriendListUser;