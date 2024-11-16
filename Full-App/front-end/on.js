
// Function to get query parameters
function getQueryParams() {
    const queryParams = new URLSearchParams(window.location.search);
    return {
        code: queryParams.get('code'),
        state: queryParams.get('state'),
        error: queryParams.get('error'),
        error_description: queryParams.get('error_description')
    };
}

// Function to display error message
function displayErrorMessage() {
    const { error, error_description } = getQueryParams();
    const errorContainer = document.getElementById('error-container');

    if (error && error_description) {
        errorContainer.textContent = `Error: ${error}\nDescription: ${decodeURIComponent(error_description)}`;
    }
}

// Function to send data using Axios
function sendData() {
    const { code, state } = getQueryParams();
    console.log('code', code)
    console.log('state', state)

    if (code && state) {
        axios.get('http://127.0.0.1:9003/login/api/oauth/callback/', { params: {
                code: code,
                state: state
            }
        })
        .then(response => {
            if (response.data.access && response.data.refresh) 
            {
                localStorage.setItem('accessToken', response.data.access);
                localStorage.setItem('refreshToken', response.data.refresh);
                window.location.href = 'dashbord/profile/profile.html';
            }
        })
        .catch(error => {
            console.error('Error sending data:', error);
        });
    }
}

// Call the functions on page load
window.onload = () => {
    displayErrorMessage();
    sendData();
};

