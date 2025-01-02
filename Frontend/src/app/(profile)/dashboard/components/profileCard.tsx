import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/slices';
import axios from 'axios';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

const ProfileCard = () => {
  const router = useRouter();
  const profileState = useSelector((state: RootState) => state.profile);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const progressPercentage = profileState.level;

  // Utility function for token retrieval
  const getAuthToken = (): string | null => localStorage.getItem('accessToken');

  // Fetch Two Factor Authentication (2FA) status
  const checkTwoFactorStatus = async () => {
    const token = getAuthToken();
    if (!token) {
      message.error('Token not found');
      return;
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/account/2FA/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setTwoFactorEnabled(response.data.success['2FA']);
    } catch (error) {
      console.log('Error fetching 2FA status', error);
      message.error('Failed to fetch 2FA status.');
    }
  };

  // Toggle 2FA
  const toggleTwoFactor = async () => {
    const token = getAuthToken();
    if (!token) {
      message.error('Token not found');
      return;
    }

    const status = !twoFactorEnabled;
    const payload = { status: status ? 'true' : 'false' };

    try {
      setLoading(true);
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/account/2FA/`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        message.success(response.data.success);
        setTwoFactorEnabled(status);
      }
    } catch (error) {
      console.log('Error toggling 2FA', error);
      message.error('Failed to toggle 2FA');
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl sm:text-3xl font-bold">{profileState.full_name}</h2>
          <p className="text-gray-400 text-lg">@{profileState.username}</p>
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
              style={{ opacity: progressPercentage > 0 ? 1 : 0 }}
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

      <div className="flex flex-col sm:flex-row justify-center sm:justify-start space-y-4 sm:space-y-0 sm:space-x-8 mt-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => router.push('/chat')}
          className="bg-[#07325F] text-white font-semibold py-2 px-6 rounded-2xl shadow hover:bg-[#0d0e0f] transition ease-in-out duration-300"
        >
          Chat now
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => router.push('/setting')}
          className="bg-[#07325F] text-white font-semibold py-2 px-6 rounded-2xl shadow hover:bg-[#0d0e0f] transition ease-in-out duration-300"
        >
          Settings
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={toggleTwoFactor}
          className="bg-[#07325F] text-white font-semibold py-2 px-6 rounded-2xl shadow hover:bg-[#0d0e0f] transition ease-in-out duration-300"
        >
          {loading ? 'Loading...' : twoFactorEnabled === null ? 'Loading...' : twoFactorEnabled ? 'Deactivate 2FA' : 'Activate 2FA'}
        </motion.button>
      </div>
    </div>
  );
};

export default ProfileCard;
