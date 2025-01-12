import axios from 'axios';

const FetchProfileUser = async (token:any, username:any) => {

    const url = `${process.env.NEXT_PUBLIC_API_URL}/account/search/?username=${username}`;
    
    const headers = {
        'Authorization': `Bearer ${token}`
    };

    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error:any) {
        if (error.response) {
                // $1.log("=====>",error.response)
        }

    }
};

export default FetchProfileUser;