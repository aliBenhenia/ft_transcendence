

import React, { useEffect } from 'react';
import { Button, notification } from 'antd';
import { useSelector } from 'react-redux';
// import acceptGameInvite from '@/services/accept_game_invite';
import rejectGameInvite from '@/services/reject_game_invite';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import axios from 'axios';

const GameNotification = () => {
  const notifications = useSelector((state: RootState) => state.notifications.notifications);
  const router = useRouter();
  const AcceptGameInvite = async(roomName:any)=> {
   
    const token = localStorage.getItem('accessToken'); 
    if (!token) {
        return;
    }
   
    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/chat/accept_game_invite/`, 
            { room_name: roomName },
            {
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                }
            }
        );
      
        if (response.status === 200)
            router.push(`/game/online?room_name=${roomName}`);

    } catch (error:any) {
        if (error.response) {
            if (error.response.status === 400) {
                message.error(error?.response?.error || "invalid game invite");
            }
        } 
    }
}

  useEffect(() => {
    const latestNotification:any = notifications[notifications.length - 1];

    if (latestNotification && latestNotification.subject === 'GAME_INVITE') {
      let isInteracted = false;

      notification.open({
        message: `GAME INVITE from ${latestNotification.sender}`,
        placement: 'bottomLeft',
        description: 'This is the content of the notification.',
        duration: 15,
        btn: (
          <div>
            <Button
              type="primary"
              onClick={() => {
                isInteracted = true;
                AcceptGameInvite(latestNotification.room_name);
                notification.destroy();
              }}
            >
              Accept
            </Button>

            <Button
              type="default"
              onClick={() => {
                isInteracted = true;
                rejectGameInvite(latestNotification.room_name);
                notification.destroy();
              }}
            >
              Refuse
            </Button>
          </div>
        ),
        onClick: () => {
        
        },
       
      });
    }
  }, [notifications]);

  return null; 
};

export default GameNotification;