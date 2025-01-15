import axios from 'axios';
import {message} from 'antd';
// import {useRouter} from 'next/navigation';

const FetchProfileUser = async (token:any, username:any) => {


    // const router = useRouter();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/account/search/?username=${username}`;
    
    const headers = {
        'Authorization': `Bearer ${token}`
    };

    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (err:any) {
        if (err.response) {
            if (err.response.status === 404) {
              message.error("User not found.");
            //   router.push("/dashboard");
            }
          }

    }
};

export default FetchProfileUser;