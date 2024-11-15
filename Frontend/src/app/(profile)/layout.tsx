"use client";

import React, { useEffect, useState, ReactNode } from 'react';
import { Dropdown } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import Nav from './components/bar';
import FriendSearch from './components/FriendSearch';
import Notification from './components/notif';
import { updateProfile } from "@/store/slices/profileSlice";
import FetchProfile from '@/services/FetchProfile';
import useWebSocket from '@/services/useWebSocket';
import { RootState } from '@/store/store';
import styles from './layout.module.css';
import { useRouter } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

interface MenuItem {
  key: string;
  label: string;
  icon: JSX.Element;
  route: string | (() => void);
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [results, setResults] = useState<string[]>([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  const profileState = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch();
  const router = useRouter();

  // useEffect(() => {
  //   // const newToken = localStorage.getItem('accessToken');
  //   // if (newToken !== null) {
  //     // setToken(newToken);
  //   }
  // }, []);

  // WebSocket setup
  useWebSocket(`ws://127.0.0.1:9003/ws/connection/?token=${token}`);

  const handleUpdateProfile = (data: Partial<RootState['profile']>) => {
    dispatch(updateProfile(data));
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || '';
    const getProfileData = async () => {
      try {
        const data = await FetchProfile(token);
        handleUpdateProfile(data.informations);
      } catch (err) {
        // Handle error appropriately
      }
    };
    getProfileData();
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/');
  };

  const navigate = (route: any) => {
    router.push(route);
  };

  const menuItems: MenuItem[] = [
    {
      key: '1',
      label: 'Profile',
      icon: <FaUser className="text-gray-400 mr-2" />,
      route: "/profile"
    },
    {
      key: '2',
      label: 'Settings',
      icon: <FaCog className="text-gray-400 mr-2" />,
      route: "/setting"
    },
    {
      key: '3',
      label: 'Logout',
      icon: <FaSignOutAlt className="text-red-400 mr-2" />,
      route: handleLogout
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#001529]">
      <Nav />
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between bg-[#001529] shadow-lg text-white p-4 border-gray-200">
          <div className="relative w-[250px] mx-auto">
            <FriendSearch />
            <AnimatePresence>
              {results.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute w-full bg-[#001529] mt-2 rounded-lg shadow-lg z-10"
                >
                  {results.map((result, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 cursor-pointer hover:bg-[#07325F] text-white transition-all duration-300 ease-in-out"
                    >
                      {result}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center space-x-4">
            <Notification />
            <Dropdown
              menu={{
                items: menuItems.map(item => ({
                  key: item.key,
                  label: (
                    <div
                      onClick={item.key === '3' ? handleLogout : () => navigate(item.route)} 
                      className="flex items-center cursor-pointer"
                    >
                      {item.icon}
                      {item.label}
                    </div>
                  ),
                })),
              }}
              placement="bottomLeft"
              overlayStyle={{ backgroundColor: '#444', borderColor: '#07325F' }}
            >
              <img
                src={profileState.picture}
                alt="Avatar"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            </Dropdown>
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
