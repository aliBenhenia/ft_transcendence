const token = localStorage.getItem('accessToken');

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};

document.getElementById("quite").addEventListener("click", async () => {  // Use "click" for event type
    try {
        const nbr = document.getElementById("number").value;  // Adjust if needed for input type
        console.log("ROOM:", nbr);

        const data = {
            room: nbr
        };

        const response = await axios.post('http://127.0.0.1:9003/tournement/quite/', data, { headers });
        
        if (response.status === 200) {
            console.log('[+] READY');
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
});

document.getElementById("join").addEventListener("click", async () => {  // Use "click" for event type
    try {

        const data = {
        
        };

        const response = await axios.post('http://127.0.0.1:9003/tournement/join/', data, { headers });
        
        if (response.status === 200) {
            console.log('[+] READY');
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
});

