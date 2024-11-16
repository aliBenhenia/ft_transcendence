async function Notification() 
{
    const token = localStorage.getItem('accessToken');
    let headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    let url = `http://127.0.0.1:9000/friends/notify/`;

    try 
    {
        const response = await axios.get(url, headers);
        let usersArray = response.data['message']['users'];
        return usersArray; 
    } 
    catch (err) 
    {
        console.error('error : ', err);
    }
}

function receiveFriendRequest(username, imageUrl) 
{

    let notification = document.createElement('div');
    notification.classList.add('bg-gray-200', 'p-2', 'rounded-md', 'mb-2', 'flex', 'items-center', 'justify-between');

    // User details container
    let userContainer = document.createElement('div');
    userContainer.classList.add('flex', 'items-center');
    
    // User image
    let userImage = document.createElement('img');
    userImage.classList.add('w-8', 'h-8', 'rounded-full', 'object-cover', 'mr-2');
    userImage.src = imageUrl;
    userContainer.appendChild(userImage);

    // Username
    let userName = document.createElement('span');
    userName.textContent = username;
    userName.style.margin = "10px"
    userName.style.paddingRight = "50px"
    userContainer.appendChild(userName);
    
    notification.appendChild(userContainer);

    // Buttons container
    let buttonContainer = document.createElement('div');
    buttonContainer.classList.add('flex', 'space-x-2');

    // Accept button
    let acceptButton = document.createElement('button');
    acceptButton.textContent = 'Accept';
    acceptButton.classList.add('bg-green-500', 'text-white', 'px-3', 'py-1', 'rounded-md', 'hover:bg-green-600');
    acceptButton.addEventListener('click', () => {
        alert(`Accepted friend request from ${username}`);
       
    });
    buttonContainer.appendChild(acceptButton);


    // Remove button
    let removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('bg-red-500', 'text-white', 'px-3', 'py-1', 'rounded-md', 'hover:bg-red-600');
    removeButton.addEventListener('click', () => {
        alert(`Removed friend request from ${username}`);

    });
    buttonContainer.appendChild(removeButton);

    notification.appendChild(buttonContainer);

    let notificationContainer = document.getElementById('notificationContainer');
    notificationContainer.appendChild(notification);
}

let notificationIcon = document.getElementById('notificationIcon');
let notificationContainer = document.getElementById('notificationContainer');

notificationIcon.addEventListener('click', () => {
    notificationContainer.classList.toggle('hidden');
});

async function Details()
{

    let numberRequest = document.getElementById('counter-request')
    
    let suggestList = await Notification();
    
    if (suggestList.length > 0) {
        numberRequest.textContent = suggestList.length
        suggestList.forEach(function(suggestItem) 
        {
            let pic = 'http://127.0.0.1:9000/users' + suggestItem.picture
            receiveFriendRequest(suggestItem.username, pic)
        })
    }
    else
       numberRequest.textContent = 0
}

Details()



