"use client";

import React, { useEffect, ReactNode } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Nav from './components/bar';
import FriendSearch from './components/FriendSearch';
import Notification from './components/notif';
import { updateProfile } from "@/store/slices/profileSlice";
import FetchProfile from '@/services/FetchProfile';
import useWebSocket from '@/services/useWebSocket';
import { RootState } from '@/store/store';
import styles from './layout.module.css';
import { useRouter } from 'next/navigation';
import DropdownMenu from './components/DropdownMenu';

interface LayoutProps {
  children: ReactNode;
}


const Layout: React.FC<LayoutProps> = ({ children }) => {
  const dispatch = useDispatch();
  useWebSocket(`ws://127.0.0.1:9003/ws/connection/?token=`);
  const handleUpdateProfile = (data: Partial<RootState['profile']>) => {
    dispatch(updateProfile(data));
  };
  useEffect(() => {
    const token = localStorage.getItem("accessToken") || '';
    const getProfileData = async () => {
      try {
        const data = await FetchProfile(token);
        handleUpdateProfile(data.informations);
      } catch (err) { }
    };
    getProfileData();
  }, []);

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
        <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className={styles.home} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
