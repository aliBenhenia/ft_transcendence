document.addEventListener("DOMContentLoaded", function() {

    const searchIn = document.getElementById('search-input')
    const suggest = document.getElementById('suggestions')

    const users = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 35 },
        { name: 'Ali', age: 40 },
        { name: 'Alex', age: 40 },
        { name: 'Almeria', age: 40 },
        { name: 'Alexa', age: 40 },

    ]

    searchIn.addEventListener('input', function() {
        const value = this.value.toLowerCase()
        suggest.innerHTML = ''

        if (value)
        {
            suggestList = users.filter(users => users.name.toLowerCase().startsWith(value)).slice(0, 3)
            if (suggestList.length > 0)
            {
                suggestList.forEach(suggestList => {
                    console.log('[*]', suggestList.name)
                    const div = document.createElement('div')
                    div.classList.add('p-2', 'border-b', 'border-gray-200', 'flex', 'justify-between', 'items-center');

                    const spanUsers = document.createElement('span')
                    spanUsers.textContent = suggestList.name
                    div.appendChild(spanUsers)

                    buttonFriend = document.createElement('button')
                    buttonFriend.classList.add('ml-2', 'px-3', 'py-1', 'bg-blue-500', 'text-white', 'rounded-md', 'hover:bg-blue-600');
                    buttonFriend.textContent = 'Add Friend'

                    div.appendChild(buttonFriend)
                    suggest.appendChild(div)
                })
                suggest.classList.remove('hidden')
            }
            else
                suggest.classList.add('hidden')
        }
        else
            suggest.classList.add('hidden')
    })
})