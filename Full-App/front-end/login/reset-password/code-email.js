async function RequestAccount(value) {
    try {
        const response = await axios.get(`http://127.0.0.1:9000/users/find-account/${value}/`);

        if (response.status === 200) 
        {    
            console.log("Account found:", response.data);
            sessionStorage.setItem('username', value)
            sessionStorage.setItem('state', false)
            document.getElementById('popup').classList.remove('hidden');
        } 
        else
        {
            console.log("Status:", response.status);
            const msg = document.getElementById("error-message")
            msg.style.visibility = "visible";

        }
    } 
    catch (e) 
    {
        const msg = document.getElementById("error-message")
        msg.style.visibility = "visible";
        console.log("[+] Error:", e);
    }
}

function FindAccount() {
    document.getElementById("change").addEventListener('click', function(event) {
        event.preventDefault();

        let email_or_username = document.getElementById("email").value;
        console.log("[+] Email or Username:", email_or_username);

        // Call RequestAccount function with the email_or_username
        RequestAccount(email_or_username);

    });
}

FindAccount();

document.getElementById('closePopup').addEventListener('click', function() {
    document.getElementById('popup').classList.add('hidden');
    window.location.href = 'verify.html'
});

// email@gmail.com 