import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/slices';
import axios from 'axios';
import { message } from 'antd'; 
import { useRouter } from 'next/navigation';

const ProfileCard = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const profileState = useSelector((state: RootState) => state.profile);
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean | null>(null);
  const progressPercentage = profileState.level;  
  

  const checkTwoFactorStatus = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get("http://127.0.0.1:9003/account/2FA/", {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setTwoFactorEnabled(response.data.success['2FA']);
    } catch (error) {
      console.log("Error fetching 2FA status", error);
      message.error("Failed to fetch 2FA status.");
    }
  };


  const toggleTwoFactor = async () => {
    const token = localStorage.getItem("accessToken");
    const status = !twoFactorEnabled;  
    const payload = { status: status ? "true" : "false" };  
    
    console.log("Authorization Token:", token);
    console.log("Payload being sent:", payload);  

    try {
      const response = await axios.post("http://127.0.0.1:9003/account/2FA/", 
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', 
          },
        }
      );


      if (response.status === 200) {
        message.success(response.data.success);
        setTwoFactorEnabled(status); 
      }
      
    } catch (error) {

    }
  };


  useEffect(() => {
    checkTwoFactorStatus();
  }, []);

  return (
    <div className="bg-[#00152993] mt-5 rounded-2xl shadow-2xl w-full p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="mx-auto sm:mx-0"
        >
          <img
            src={profileState.picture}
            alt="Avatar"
            className="rounded-full border-4 border-white hover:border-blue-500 transition duration-500 ease-in-out"
            style={{ width: '100px', height: '100px' }}
          />
        </motion.div>
        <div className="text-white text-center sm:text-left mt-6 sm:mt-0 sm:ml-8 flex-1">
          <h2 className="text-2xl sm:text-3xl font-bold">{profileState.full_name }</h2>
          <p className="text-gray-400 text-lg">@{profileState.username || "Doe"}</p>
        </div>
        <div className="w-full mt-6 sm:mt-0 sm:max-w-xs">
          <h3 className="text-white text-sm font-semibold text-center sm:text-left">Level Progress</h3>
          <div className="relative bg-[#0d0e0f] rounded-full h-6 w-full overflow-hidden mt-2">
  <motion.div
    className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full shadow-md"
    style={{ width: `${progressPercentage}%` }}
    initial={{ width: '0%' }}
    animate={{ width: `${progressPercentage}%` }}
    transition={{ duration: 1.5, ease: 'easeInOut' }}
  />
  <motion.div
    className="absolute top-1/2 left-1/2 text-sm font-bold text-white transform -translate-x-1/2 -translate-y-1/2 z-[55]"
    style={{ opacity: progressPercentage > 0 ? 1 : 0 }} // Hide the number until the progress starts
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.5, ease: 'easeInOut' }}
  >
    {progressPercentage}xp
  </motion.div>
</div>

          <motion.p
            className="text-gray-400 text-sm mt-2 text-center sm:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            {progressPercentage} XP
          </motion.p>
        </div>
      </div>
      <div className="flex justify-center sm:justify-start space-x-4 sm:space-x-8 mt-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => router.push("/chat")}
          className="bg-[#07325F] text-white font-semibold py-2 px-6 rounded-2xl shadow hover:bg-[#0d0e0f] transition ease-in-out duration-300"
        >
          Chat now
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="bg-[#07325F] text-white font-semibold py-2 px-6 rounded-2xl shadow hover:bg-[#0d0e0f] transition ease-in-out duration-300"
          onClick={() => router.push("/setting")}
        >
          Settings
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={toggleTwoFactor}
          className={`bg-[#07325F] text-white font-semibold py-2 px-6 rounded-2xl shadow hover:bg-[#0d0e0f] transition ease-in-out duration-300`}
        >
          {twoFactorEnabled === null ? "Loading..." : twoFactorEnabled ? "Deactivate 2FA" : "Activate 2FA"}
        </motion.button>
      </div>
    </div>
  );
};

export default ProfileCard;