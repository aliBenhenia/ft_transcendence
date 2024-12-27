
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { notification, Avatar,Button } from 'antd';
import { addNotification, togleOnline } from '@/store/slices/notificationsSlice';
import { useRouter } from 'next/navigation';


interface ServerMessage {
  case: 'ONLINE' | 'OFFLINE' | 'NEW_MESSAGE' | 'INVITATION' | 'DECLINE' | 'ACCEPT' | 'UNFRIEND' | `GAME_INVITE`;
  sender: string;
  picture?: string;
  'full-name'?: string;
  room_name ? : string

}

const useWebSocket = (url: string) => {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    // const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const token = localStorage.getItem('accessToken');
    if (!url || !token) return;
    const socket = new WebSocket(`${url}${token}`);

    const handleNotification = (message: string, content: string, icon: React.ReactNode = null, duration: number = 5) => {
      notification.open({
        message,
        description: content,
        placement: 'bottomLeft',
        icon,
        duration,
        onClick: () => {
          console.log(`${message} Clicked!`);
        },
      });
    };


    const addNewNotification = (serverMessage: ServerMessage) => {
      const newNotification = {
        seen: false,
        time: new Date().toISOString(),
        subject: serverMessage.case,
        sender: serverMessage.sender,
        picture: serverMessage.picture,
        'full-name': serverMessage['full-name'] || 'Unknown Sender',
        room_name :serverMessage.room_name
      };
      dispatch(addNotification(newNotification));
    };

    socket.onopen = () => {
      console.log("WebSocket connection established.");
    };

    socket.onmessage = (event: MessageEvent) => {
      console.log("WebSocket message received:", event.data);
      const serverMessage = JSON.parse(event.data);
      const { case: messageCase, sender, picture } = serverMessage;

      switch (messageCase) {
        case 'ONLINE':
        case 'OFFLINE':
          dispatch(togleOnline(serverMessage));
          break;

        case 'NEW_MESSAGE':
          handleNotification(
            'New Message',
            `Request from: ${sender}`,
            React.createElement(Avatar, { src: picture }),
            2
          );
          addNewNotification(serverMessage);
          break;

        case 'INVITATION':
          handleNotification('New Friend Request', `Request from: ${sender}`,React.createElement(Avatar, { src: picture }), 2);
          addNewNotification(serverMessage);
          break;

        case 'DECLINE':
          handleNotification('Cancelled Friend Request', `Cancelled from: ${sender}`,React.createElement(Avatar, { src: picture }), 2);
          addNewNotification(serverMessage);
          break;

        case 'ACCEPT':
          handleNotification('Friend Request Accepted', `Accepted from: ${sender}`,React.createElement(Avatar, { src: picture }), 2);
          addNewNotification(serverMessage);
          break;

        case 'UNFRIEND':
          handleNotification('Unfriended', `Unfriended by: ${sender}`,React.createElement(Avatar, { src: picture }), 2);
          addNewNotification(serverMessage);
          break;
        case "GAME_INVITE":
          handleNotification('Game Invite', `Invite from: ${sender}`,React.createElement(Avatar, { src: picture }), 2);
          addNewNotification(serverMessage);
          break;
        case "GAME_READY":
          router.push(`/game/${serverMessage.room_name}`)
            
            break;
        default:
          console.warn("Unhandled message case:", messageCase);
      }
    };

    socket.onerror = (error) => {
      console.log("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
        socket.close();
    };
  }, []);
};

export default useWebSocket;
