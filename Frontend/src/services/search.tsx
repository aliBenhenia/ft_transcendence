import axios from 'axios'

async function search(queryKey:any, token:any) {
    const url = `http://127.0.0.1:9000/friends/list/${queryKey}/`;

    let headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.get(url, headers);
        let usersArray = response.data.message.users;
        return usersArray;
    } catch (err) {
        console.log('Error:', err);
        return [];  // return empty array in case of error
    }
}
export default search;
