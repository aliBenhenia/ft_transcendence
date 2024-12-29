"use client";

import React, { useEffect, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Nav from './components/bar';
import FriendSearch from './components/FriendSearch';
import Notification from './components/notif';
import { updateProfile } from "@/store/slices/profileSlice";
import FetchProfile from '@/services/FetchProfile';
import useWebSocket from '@/services/useWebSocket';
import acceptGameInvite from '@/services/accept_game_invite';
import rejectGameInvite  from '@/services/reject_game_invite';
import { RootState } from '@/store/store';
import styles from './layout.module.css';
import DropdownMenu from './components/DropdownMenu';
import {message,Button, notification} from 'antd'

interface LayoutProps {
  children: ReactNode;
}
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  const urlSocket = process.env.NEXT_PUBLIC_API_URL || "localhost:9003";
  const { notifications, unreadCount, error } = useSelector(state => (state as any).notifications);
  useWebSocket(`ws://${urlSocket.slice(7)}/ws/connection/?token=`);
  useEffect(() => {
    const token = localStorage.getItem("accessToken") || '';
    const getProfileData = async () => {
      try {
        const data = await FetchProfile(token);
        dispatch(updateProfile(data.informations));
      } catch (err) { }
    };
    getProfileData();
  }, []);


  useEffect(()=>{
    const latestNotification = notifications[notifications.length - 1]; 
    if (latestNotification && latestNotification.subject === `GAME_INVITE`)
    {
      console.log(`recueved data ===>`,latestNotification);
      notification.open({
        message: `GAME INVITE from ${latestNotification.sender}`,
        description: 'This is the content of the notification.',
        duration: 33,
        btn: (
          <div>
            <Button type="primary" onClick={() => acceptGameInvite(latestNotification.room_name)}>Accept</Button>
            <Button type="danger" onClick={() => rejectGameInvite(latestNotification.room_name)()}>refuse</Button>
          </div>
        ),
        onClick: () => {
          console.log('Notification Clicked!');
        },
      });
    }
     
  },[notifications])



  return (
    <div className="flex h-screen overflow-hidden bg-[#001529]">
      <Nav />
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-[#001529] shadow-lg text-white p-4 border-gray-200">
          <div className="relative w-[250px] mx-auto">
            <FriendSearch />
          </div>
          <div className="flex items-center space-x-4">
            <Notification />
            <DropdownMenu />
          </div>
        </header>
        <main className="flex-1 " style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className={styles.home} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
