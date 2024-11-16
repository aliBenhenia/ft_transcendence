document.getElementById('resetForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const token = localStorage.getItem('accessToken');
    
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }
    
    const formData = {
      old_password: oldPassword,
      new_password: newPassword
    };
  
    try {
      const response = await axios.post('http://127.0.0.1:9000/users/password-reset/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.status === 200) {
        document.getElementById('successMessage').classList.remove('hidden');
        document.getElementById('errorMessage').classList.add('hidden');
        window.location.href = '../profile.html';
      }
    } catch (error) {
      document.getElementById('errorMessage').classList.remove('hidden');
      document.getElementById('successMessage').classList.add('hidden');
      console.error('Error:', error);
    }
  });
  