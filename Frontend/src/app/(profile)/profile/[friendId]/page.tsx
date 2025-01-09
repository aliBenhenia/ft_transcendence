"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GameStats from "../GameStates";
import LastMatchesCard from "../LastMatchesCard";
import FetchProfileUser from "@/services/fetchProfileUser";
import axios from 'axios';
import { motion } from 'framer-motion';
import { message } from "antd"; 
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store'; 
import { PinContainer } from "@/components/3d-pin";
import Achievements from "../../components/ach"
import { MdBlockFlipped } from "react-icons/md";
import { TbLockOpen2 } from "react-icons/tb";
import { FaUserPlus } from 'react-icons/fa'
import { FaTimes } from 'react-icons/fa';
import { FaComment } from 'react-icons/fa';


interface profileData {
  username: string;
  full_name: string;
  picture: string;
  level: number;
  win: number;
  loss: number;
  total_match: number;
  last_match?: string;
  id? : number;
  level_percentage?: number;
}
const ProfilePage = (props: any) => {
  const { unreadCount } = useSelector((state: RootState) => state.notifications);
  const profileState = useSelector((state: RootState) => state.profile);
  const router = useRouter();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<profileData>({ username: "", full_name: "", picture: "", level: 0, win: 0, loss: 0, total_match: 0 ,id:0,level_percentage:0});
  const [friendStatus, setFriendStatus] = useState("not_friends");
  const [blockStatus, setBlockStatus] = useState(false);
  const [listFriends, setListFriends] = useState([]);

  const isUser = (user: string) => profileState.username === user;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError(true);
      setLoading(false);
      return;
    }

    const getProfileData = async () => {
      try {
        const data = await FetchProfileUser(token, props.params.friendId);
        if (isUser(data.account.username)) router.push("/dashboard");
        setProfileData(data.account);
        setListFriends(data.details.friends);
        setError(false);
      } catch (err) {
        setError(true);
        // console.log("Error fetching profile data:", err);
      } finally {
        setLoading(false);
      }
    };

    const checkFriendAndBlockStatus = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends/status/?username=${props.params.friendId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("accessToken")}` },
        });

        if (response.data.success) {
          const { is_friends, on_request, is_blocked } = response.data.success;
          if (is_blocked)
            router.push("/dashboard");
          setFriendStatus(is_friends ? "friends" : on_request ? "pending" : "not_friends");
          if (is_blocked)
            setFriendStatus("friends");
          setBlockStatus(is_blocked);
        }
      } catch (error:any) {
        const errorMessage = error.response ? error.response.data.error : error.message;
        message.error(errorMessage);
        router.push("/dashboard");
      }
    };

    getProfileData().then(() => checkFriendAndBlockStatus());
  }, [props.params.friendId, unreadCount]);

  const handleSendFriendRequest = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !profileData.username) {
      message.error("Invalid token or username.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/friends/request/`, {
        username: profileData.username,
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.data.success) {
        message.success("Friend request sent successfully!");
        setFriendStatus("pending");
      }
    } catch (error:any) {
      const errorMessage = error.response ? error.response.data.error : error.message;
      message.error(errorMessage);
      // console.log("Error sending friend request:", errorMessage);
    }
  };

  const handleCancelFriendRequest = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !profileData.username) {
      message.error("Invalid token or username.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/friends/decline/`, {
        username: profileData.username,
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.data.success) {
        message.success("You have successfully declined the friend request.");
        setFriendStatus("not_friends");
      }
    } catch (error:any) {
      const errorMessage = error.response ? error.response.data.error : error.message;
      message.error(errorMessage);
      // console.log("Error canceling friend request:", errorMessage);
    }
  };

  const handleBlockUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !profileData.username) {
      message.error("Invalid token or username.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/friends/block/`, {
        username: profileData.username,
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.data.success) {
        message.success("User has been blocked successfully!");
        setBlockStatus(true);
        router.push("/dashboard");
      }
    } catch (error:any) {
      const errorMessage = error.response ? error.response.data.error : error.message;
      message.error(errorMessage);
      // console.log("Error blocking user:", errorMessage);
    }
  };

  const handleUnblockUser = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !profileData.username) {
      message.error("Invalid token or username.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/friends/unblock/`, {
        username: profileData.username,
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.data.success) {
        message.success("User has been unblocked successfully!");
        setBlockStatus(false);
      }
    } catch (error:any) {
      const errorMessage = error.response ? error.response.data.error : error.message;
      message.error(errorMessage);
      // console.log("Error unblocking user:", errorMessage);
    }
  };

  return (
    <div className="h-screen">
      <div className="py-12 px-6 w-full flex">
        <div className="w-full">
          <motion.div className="relative mx-auto bg-[#00152993] rounded-2xl shadow-lg overflow-hidden">
            <PinContainer className="w-full object-cover" title={profileData.username} href={profileData.username}>
              <img
                className="w-full h-56 object-cover"
                src="https://antmedia.io/wp-content/uploads/2023/04/gamer-chair-with-multicolored-neon-lights-1-scaled.jpg"
                alt="Cover"
              />
            </PinContainer>
            <div className="p-4 pt-0">
              <div className="flex items-center">
                <img
                  className="w-24 h-24 rounded-full border-4 border-white absolute top-44 left- z-[88] bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-1 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
                  src={profileData.picture}
                  alt="Avatar"
                />
                <div className="">
                  <h2 className="text-2xl font-semibold text-white">{profileData.full_name}</h2>
                  <p className="text-gray-300">@{profileData.username}</p>
                </div>
              </div>
              <div className="mt-6">
                <header className="mt-6">
                  <h3 className="text-white text-sm font-semibold text-center sm:text-left">Level Progress</h3>
                  <div className="relative bg-[#0d0e0f] rounded-full h-6 w-full overflow-hidden mt-2">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full shadow-md"
                      style={{ width: `${profileData.level_percentage}%` }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${profileData.level_percentage}%` }}
                      transition={{ duration: 1.5, ease: 'easeInOut' }}
                    />
                    <motion.div
                      className="absolute top-0 left-0 text-sm font-bold text-white"
                      style={{ transform: `translateX(${profileData.level_percentage - 5}%)` }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1.5, ease: 'easeInOut' }}
                    >
                      {profileData.level_percentage} %
                    </motion.div>
                  </div>
                  <motion.p
                    className="text-gray-400 text-sm mt-2 text-center sm:text-left"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.5 }}
                  >
                    {profileData.level} level
                  </motion.p>
                </header>
              </div>
             
              <div className="mt-4 flex flex-col sm:flex-row justify-around gap-4">
                <button
                  onClick={() => router.push(`/chat`)}
                  className="flex items-center justify-center py-3 px-5 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 ease-in-out"
                >
                  <FaComment className="mr-2 text-xl" />  {/* Add chat icon with margin */}
                  Chat Now
                </button>
                {friendStatus === "not_friends" && (
                  <button
                  className="flex items-center justify-center py-3 px-5 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out"
                  onClick={handleSendFriendRequest}
                >
                  <FaUserPlus className="mr-2 text-xl" /> {/* Icon with margin */}
                  Send Request
                </button>
                )}
                {friendStatus === "pending" && (
                  <>
                  <button
            className="flex items-center justify-center py-3 px-5 bg-red-600 text-white text-lg font-semibold rounded-xl hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 ease-in-out"
            onClick={handleCancelFriendRequest}
          >
            <FaTimes className="mr-2 text-xl" />
            Cancel Request
          </button>

                  </>
                )}
                {friendStatus === "friends" && (
                  <>
                    {blockStatus ? (
                      <button
                      onClick={handleUnblockUser}
                      className="flex items-center justify-center py-3 px-5 bg-yellow-600 text-white text-lg font-semibold rounded-xl hover:bg-yellow-700 active:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform "
                    >
                      <TbLockOpen2 className="mr-2 text-xl" />
                      Unblock
                    </button>
                    
                    ) : (
                          <button
      onClick={handleBlockUser}
      className="flex items-center justify-center py-3 px-5 bg-red-600 text-white text-lg font-semibold rounded-xl hover:bg-red-700 active:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform "
    >
      <MdBlockFlipped className="mr-2 text-xl" />
      Block
    </button>
                    )}
                  </>
                )}
              </div>


            </div>
          </motion.div>
          <div className="flex gap-3 flex-col">
            <GameStats
              level={profileData.level}
              loss={profileData.loss}
              matches={profileData.total_match}
              win={profileData.win}
              isUser={props.params.friendId}
              last_match= {profileData.last_match}
            />
           {
            profileData.id &&  <LastMatchesCard userId={profileData.id} />
           }
          </div>
        </div>
        <Achievements />
      </div>
    </div>
  );
};

export default ProfilePage;