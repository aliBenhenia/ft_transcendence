"use client";
import React,{ useState } from 'react';
import { motion } from 'framer-motion';
interface ProfileCardProps {
  avatar: string;
  first_name: string;
  last_name: string;
  level: number;
  isFriend?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ avatar, first_name, last_name, level}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative mx-auto bg-[#00152993] rounded-2xl shadow-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)' }}
      transition={{ duration: 0.3 }}
    >
      <img
        className="w-full h-56 object-cover"
        src="https://antmedia.io/wp-content/uploads/2023/04/gamer-chair-with-multicolored-neon-lights-1-scaled.jpg"
        alt="Cover"
      />
      <div className="p-4">
        <div className="flex items-center">
          <img
            className="w-24 h-24 rounded-full border-4 border-white absolute top-44 left-4"
            src={avatar}
            alt="Avatar"
          />
          <div className="ml-24">
            <h2 className="text-2xl font-semibold">{first_name} {last_name}</h2>
            <p className="text-gray-600">@{last_name}</p>
          </div>
        </div>

        <header className="mt-6">
          <h3 className="text-white text-sm font-semibold text-center sm:text-left">Level Progress</h3>
          <div className="relative bg-[#0d0e0f] rounded-full h-6 w-full overflow-hidden mt-2">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full shadow-md"
              style={{ width: `${level}%` }} 
              initial={{ width: '0%' }}
              animate={{ width: `${level}%` }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute top-0 left-0 text-sm font-bold text-white"
              style={{ transform: `translateX(${level - 5}%)` }} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            >
              {level}%
            </motion.div>
          </div>
          <motion.p
            className="text-gray-400 text-sm mt-2 text-center sm:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            {level}% Completed
          </motion.p>
        </header>
      </div>
    </motion.div>
  );
};

export default ProfileCard;