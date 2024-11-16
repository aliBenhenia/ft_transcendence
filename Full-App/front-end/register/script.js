// Handle form submission
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(this); // Get form data
    axios.post('http://127.0.0.1:9000/users/register/', formData)
        .then(function(response) {
            if (response.status === 201) {
                document.getElementById('popup').classList.remove('hidden'); // Show popup on successful registration
            } else {
                let errorElement = document.querySelector('.errormessage');
                if (errorElement) {
                    errorElement.textContent = "Registration failed. Please check your details.";
                }
            }
        })
        .catch(function(error) {
            console.error('Registration error:', error); // Log any registration errors
            let errorElement = document.querySelector('.errormessage');
            if (errorElement) {
                errorElement.textContent = "Registration failed.";
            }
        });
});

// Close popup
document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('popup').classList.add('hidden'); // Hide popup on close button click
});