function Verify(event) {
    event.preventDefault(); // Prevent default form submission
    
    var code = document.getElementById("otp").value;
    const token = localStorage.getItem('accessToken');
    
    const formData = new FormData();
    formData.append('2fa', code);
    
    axios.post('http://127.0.0.1:9000/users/otp-verify/', formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(response => {
        console.log('Response status code:', response.status);
        if (response.status === 200) {
            console.log('OTP verified successfully');
            console.log('Response data:', response.data);
            document.getElementById('popup').classList.remove('hidden'); 
            setTimeout(() => {
                window.location.href = '../../dashbord/profile.html';
            }, 2000)
        } else {
            console.log('Unexpected response status:', response.status);
        }
    })
    .catch(error => {
        console.error('Error verifying OTP:', error);
        // Handle error cases, e.g., display an error message to the user
    });
}
