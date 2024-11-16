document.getElementById("skip").addEventListener('click', function(){
    window.location.href = "../../../dashbord/profile/profile.html"
})

document.getElementById('change').addEventListener('click', async function(event) {
    event.preventDefault();
  
    const token = localStorage.getItem('accessToken');
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const formData = {
      password: newPassword,
      re_password: confirmPassword
    };
  
    try {
      const response = await axios.post('http://127.0.0.1:9000/users/rest-password/update/', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });
      if (response.status === 200) 
      {

        console.log('[message]: ', response.data['message'])
        const hide = document.getElementById("error-message")
        const message =  document.getElementById("success-message")
        message.textContent = response.data['message']
        hide.style.visibility = "hidden";
        message.style.visibility = "visible";

        setTimeout(() => {
            window.location.href = "../../../dashbord/profile/profile.html"
        }, 2000);
        
      }
    } 
    catch (error) 
    {
        console.log('[!] [message]: ',  error.response.data['message'])
        const hide =  document.getElementById("success-message")
        const message = document.getElementById("error-message")
        message.textContent = error.response.data['message']
        message.style.visibility = "visible";
        hide.style.visibility = "hidden";
    }
  });
  
