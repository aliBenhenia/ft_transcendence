"use client";

import { useState, useEffect } from "react";
import { Menu, Layout, Avatar } from "antd";
import {
  FaHome,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaGamepad,
  FaTrophy,
  FaCommentAlt,
  FaAngleDoubleRight,
  FaAngleDoubleLeft,
  FaSearch
} from 'react-icons/fa';
import { GiChampions } from "react-icons/gi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

const { Sider } = Layout;

const Nav = () => {
  const profileState = useSelector((state: RootState) => state.profile);
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("accessToken");
    router.push("/");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { label: <Link href="/dashboard">Dashboard</Link>, key: "1", icon: <FaHome className="text-xl" /> },
    { label: <Link href="/profile">Profile</Link>, key: "2", icon: <FaUser className="text-xl" /> },
    { label: <Link href="/game">Game</Link>, key: "3", icon: <FaGamepad className="text-xl" /> },
    { label: <Link href="/tournament">tournament</Link>, key: "4", icon: <GiChampions className="text-xl"/> },
    { label: <Link href="/chat">Chat</Link>, key: "5", icon: <FaCommentAlt className="text-xl" /> },
    { label: <Link href="/leaderboard">Leaderboard</Link>, key: "6", icon: <FaTrophy className="text-xl" /> },
    { label: <Link href="/setting">Setting</Link>, key: "7", icon: <FaCog className="text-xl" /> },
    { label: <Link href="/req">Friends</Link>, key: "8", icon: <FaSearch className="text-xl" /> },
    // { label: <span  onClick={handleLogout}>Logout</span>, key: "8", icon: <FaSignOutAlt onClick={handleLogout} className="text-xl" />, style: { backgroundColor: "red" } }
  ];

  return (
    <>
      <button
        className="absolute top-4 left-4 text-white z-50 transform transition-all duration-300 ease-in-out hover:scale-125"
        onClick={toggleCollapse}
        style={{ zIndex: 9999 }}
      >
        {collapsed ? (
          <FaAngleDoubleRight className="text-2xl hover:text-blue-400 transform hover:scale-125 transition-transform duration-300 ease-in-out" />
        ) : (
          <FaAngleDoubleLeft className="text-2xl hover:text-blue-400 transform hover:scale-125 transition-transform duration-300 ease-in-out" />
        )}
      </button>

      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={`h-full bg-[#001529] text-white transition-all duration-500 ease-in-out ${collapsed ? 'w-16' : 'w-64'} `}
        style={{
          position: isMobile ? "absolute" : "relative",
          zIndex: 100,
          left: isMobile && collapsed ? '-100%' : '0',
        }}
      >
        <div className={`flex flex-col justify-center items-center mb-6 transition-all duration-500 ease-in-out mt-3 ${collapsed ? 'opacity-0' : 'opacity-100'}`}>
          <Avatar
            size={64}
            src={profileState.picture}
            className="border-4 border-white hover:border-blue-400 transform hover:scale-110 transition-transform duration-300 ease-in-out"
          />
          <p className="mt-2 text-gray-500 font-bold font-mono">@{profileState.username}</p>
        </div>

        <Menu theme="dark" mode="inline" items={menuItems} className="text-lg " />
        <div className="absolute bottom-4 left-0 w-full">
          <button
            className="text-white bg-red-500 hover:text-red-400 p-5 w-full flex justify-center items-center"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-xl hover:text-blue-400 transform hover:scale-125 transition-transform duration-300 ease-in-out" />
          </button>
        </div>
      </Sider>
    </>
  );
};

export default Nav;
