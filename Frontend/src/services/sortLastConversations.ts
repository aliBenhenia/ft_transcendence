interface User {
  username: string;

}

interface ConversationItem {
  on_talk: string;

}

interface ConversationResponse {
  info: ConversationItem[];
}

const sortLastConversations = async (users: User[]): Promise<User[] | undefined> => {
  if (users.length <= 1) return users;

  const token = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/list-conversation/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: ConversationResponse = await response.json();

    const onTalkUsernames = data.info
      .filter(item => typeof item === 'object' && item.on_talk)
      .map(item => item.on_talk);

    const sortedUsers: User[] = [];

    onTalkUsernames.forEach(username => {
      const user = users.find(user => user.username === username);
      if (user) {
        sortedUsers.push(user);
      }
    });

    users.forEach(user => {
      if (!onTalkUsernames.includes(user.username) && !sortedUsers.includes(user)) {
        sortedUsers.push(user);
      }
    });
    return sortedUsers;
  } catch (err) {
    console.log("Error fetching conversations:", err);
    return undefined;
  }
};

export default sortLastConversations;
