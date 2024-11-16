document.getElementById('uploadForm').addEventListener('submit', function(event) {
    const token = localStorage.getItem('accessToken');
    event.preventDefault();
    
    const formData = new FormData();
    const picture = document.getElementById('picture').files[0];
    
    if (picture) {
      formData.append('avatar', picture);
      
        axios.post('http://127.0.0.1:9000/users/api/profile/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 201) 
            {
                document.getElementById('successMessage').classList.remove('hidden');
                document.getElementById('errorMessage').classList.add('hidden');
            }
       })
       .catch(error => {
        document.getElementById('errorMessage').classList.remove('hidden');
        document.getElementById('successMessage').classList.add('hidden');
      });
    }
});
