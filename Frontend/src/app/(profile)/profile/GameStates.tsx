"use client";
import { useState ,useEffect} from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaStar, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import {Image} from "antd"
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications } from "@/store/slices/notificationsSlice";
import Link from 'next/link'
import getFriendListUser from '@/services/getFriendsList';
import { RootState } from '@/store/store';

const achievements = [
  { title: "First Win", description: "Completed 10 Wins", icon: <FaTrophy />, completed: true },
  { title: "Rookie", description: "Achieved 5 Wins", icon: <FaMedal />, completed: true },
  { title: "Star Player", description: "Completed 20 Wins", icon: <FaStar />, completed: false },
  { title: "Champion", description: "Achieved 50 Wins", icon: <FaCheckCircle />, completed: false },
  { title: "Legend", description: "Achieved 100 Wins", icon: <FaRegCircle />, completed: false },
];

interface Friend {
  id: number;
  full_name: string;
  username: string;
  picture: string;
}
function FriendCard({ friend }: { friend: Friend }) {
  return (
    <div
      className="mt-5 bg-[#07325F] rounded-l-2xl rounded-r-md shadow-md hover:scale-105  transition-transform duration-300 cursor-pointer flex flex-col items-center rounded-br-2xl "    >
      <div className="flex justify-center -mt-8">
        <Image
            src={friend.picture}
            alt="Avatar"
            width={99}
            height={99}
            className="w-24 h-24 rounded-full border-4 border-white  bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-1 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
          />
      </div>
      <div className="p-4 text-center">
        <h2 className="font-bold text-sm text-white">{friend.full_name}</h2>
        <p className="text-sm text-gray-400">@{friend.username}</p>
      </div>
      <Link href={`/profile/${friend.username}`} className='w-full'>
          <button className=" bg-slate-800 text-white py-2 px-4 w-full rounded-bl-2xl rounded-br-2xl hover:opacity-90 hover:blur transition-colors duration-300">
            View Profile
          </button>
      </Link>
    </div>
  );
}

interface GameStatsProps {
  level: number;
  loss: number;
  matches: number;
  win: number;
  isUser?: string;
}
const GameStats = ({ level, loss, matches, win,isUser }:GameStatsProps) => {
  const [activeTab, setActiveTab] = useState('stats');
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState(null);
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  const { notifications } = useSelector((state: RootState) => state.notifications);
  
  useEffect(() => {
   
    const fetchFriendsList = async () => {
      if (isUser)
      {
        const list = await getFriendListUser(accessToken,isUser);
        setFriends(list);
        return ;
      }
           
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends/list/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
           
            const data = response.data;
            console.log("======>",data);

            if (data.vide) {
                setFriends([]); // No friends found
            } else {
              console.log("-->",data.information);// is_blocked in each object item
                setFriends(data.information.filter((item:any)=> item.is_blocked !== true)); // Set friends list
            }
        } catch (err:any) {
          console.log(err.message)
            setError(err.message); // Capture any error
        }
    };

    fetchFriendsList();
}, [notifications]); // Run effect when accessToken changes

  return (
    <div className="bg-[#00152993] rounded-2xl shadow-lg overflow-hidden mt-5 w-full h-[413px] overflow-y-scroll relative">
    {/* Sticky Tab Navigation */}
    <div className="sticky top-0 z-10 flex items-center justify-around w-full p-2 bg-[#00152993] backdrop-blur-md left-0">
      <button
        className={`flex flex-col items-center w-1/3 py-2 text-lg font-semibold rounded-2xl ${activeTab === 'stats' ? 'bg-blue-600 text-white shadow-lg' : 'bg-transparent text-gray-600  hover:text-blue-600'} transition-all duration-300 ease-in-out`}
        onClick={() => setActiveTab('stats')}
      >
        <FaStar className="text-2xl" />
        <span className="text-xs">Stats</span>
      </button>
      <button
        className={`flex flex-col items-center w-1/3 py-2 text-lg font-semibold rounded-2xl ${activeTab === 'achievements' ? 'bg-blue-600 text-white shadow-lg' : 'bg-transparent text-gray-600  hover:text-blue-600'} transition-all duration-300 ease-in-out`}
        onClick={() => setActiveTab('achievements')}
      >
        <FaTrophy className="text-2xl" />
        <span className="text-xs">Achievements</span>
      </button>
      <button
        className={`flex flex-col items-center w-1/3 py-2 text-lg font-semibold rounded-2xl ${activeTab === 'friends' ? 'bg-blue-600 text-white shadow-lg' : 'bg-transparent text-gray-600  hover:text-blue-600'} transition-all duration-300 ease-in-out`}
        onClick={() => setActiveTab('friends')}
      >
        <FaRegCircle className="text-2xl" />
        <span className="text-xs">Friends</span>
      </button>
    </div>
  
    {/* Content Section */}
    <div className="p-4 space-y-4">
      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="p-4 rounded-2xl shadow-md mt-5">
          <div className="rounded-2xl p-4 shadow-lg md:mt-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div className="text-white bg-[#07325F] rounded-2xl p-3 transition-all shadow-2xl">
                <p className="text-sm uppercase tracking-wide text-gray-400">Losses</p>
                <p className="text-2xl font-bold text-red-500">{loss}</p>
              </div>
              <div className="text-white bg-[#07325F] rounded-2xl p-3 transition-all shadow-2xl">
                <p className="text-sm uppercase tracking-wide text-gray-400">Matches</p>
                <p className="text-2xl font-bold text-yellow-500">{matches}</p>
              </div>
              <div className="text-white bg-[#07325F] rounded-2xl p-3 transition-all shadow-2xl">
                <p className="text-sm uppercase tracking-wide text-gray-400">Wins</p>
                <p className="text-2xl font-bold text-green-500">{win}</p>
              </div>
              <div className="text-white bg-[#07325F] rounded-2xl p-3 transition-all shadow-2xl">
                <p className="text-sm uppercase tracking-wide text-gray-400">Last Match</p>
                <p className={`text-2xl font-bold ${win > loss ? 'text-green-500' : 'text-red-500'}`}>
                  {win > loss ? 'Win' : 'Loss'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
  
      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {achievements.map((achievement, idx) => (
              <div
                key={idx}
                className={`cursor-pointer relative flex items-center justify-center p-4 rounded-2xl shadow-lg transition-transform duration-300 transform cursor-pointer hover:scale-105 ${
                  achievement.completed ? 'bg-[#07325F]' : 'bg-gray-700 opacity-50 blur-sm'
                }`}
              >
                <div className="flex flex-col items-center">
                  <div className="text-white text-5xl transition-transform duration-300 transform hover:scale-125">
                    {achievement.icon}
                  </div>
                  <div className="text-white text-lg mt-2">{achievement.title}</div>
                  <div className="text-sm text-gray-300">{achievement.description}</div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-center bg-black bg-opacity-60 opacity-0 transition-opacity duration-300 hover:opacity-100 rounded-2xl">
                  <div className="transform transition-transform duration-300 scale-100 hover:scale-110">
                    <p className="font-bold text-lg">{achievement.title}</p>
                    <p className="text-sm text-gray-300">{achievement.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
  
      {/* Friends Tab */}
      {activeTab === 'friends' && (
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.isArray(friends) && friends.map((friend, idx) => (
              <FriendCard friend={friend} key={idx} />
            ))}
            {
              Array.isArray(friends) && friends.length === 0 && (
                <h2 className="text-xl font-semibold text-gray-300 text-center mt-20 hover:text-gray-100 transition duration-300 w-full">
                  No friends to display
                </h2>
              )
            }
          </div>
        </div>
      )}
    </div>
  </div>
  
  );
};

export default GameStats;