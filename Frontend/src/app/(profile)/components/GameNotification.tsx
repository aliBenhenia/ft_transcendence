

import React, { useEffect } from 'react';
import { Button, notification } from 'antd';
import { useSelector } from 'react-redux';
import acceptGameInvite from '@/services/accept_game_invite';
import rejectGameInvite from '@/services/reject_game_invite';
import { RootState } from '@/store/store';

const GameNotification = () => {
  const notifications = useSelector((state: RootState) => state.notifications.notifications);

  useEffect(() => {
    const latestNotification = notifications[notifications.length - 1];

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
                acceptGameInvite(latestNotification.room_name);
                notification.destroy();
              }}
            >
              Accept
            </Button>

            <Button
              type="danger"
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