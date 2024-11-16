document.getElementById('profileForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const token = localStorage.getItem('accessToken');

    const formData = new FormData();
    const avatar = document.getElementById('pic').files[0];
    const firstName = document.getElementById('f_name').value;
    const lastName = document.getElementById('l_name').value;
    const oldPassword = document.getElementById('old').value;
    const password = document.getElementById('pass').value;
    const rePassword = document.getElementById('repass').value;

    if (avatar) {
        formData.append('picture', avatar);
    }
    if (firstName) {
        formData.append('first_name', firstName);
    }
    if (lastName) {
        formData.append('last_name', lastName);
    }
    if (oldPassword) {
        formData.append('old_password', oldPassword);
    }
    if (password) {
        formData.append('new_password', password);
    }
    if (rePassword) {
        formData.append('re_password', rePassword);
    }

    axios.post('http://127.0.0.1:9003/account/update/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
    })
    .then(response => {

        console.log('Success:', response.data);
        alert('Profile updated successfully');
    })
    .catch(error => {
        console.log(error.response.data['error'])
        console.error('Error:', error.response);
        alert('Failed to update profile');
    });
});