"use client";

import React, { useState } from "react";
import { FaTrophy, FaMedal, FaStar, FaAward } from "react-icons/fa"; // Import icons
import { motion } from "framer-motion";



const Achievements: React.FC = () => {
  const [achievements] = useState([
    { id: 1, title: "Tournament Champion", icon: <FaTrophy className="text-yellow-400" /> },
    { id: 2, title: "Top Scorer", icon: <FaMedal className="text-blue-400" /> },
    { id: 3, title: "Most Wins", icon: <FaStar className="text-green-400" /> },
    { id: 4, title: "Player of the Month", icon: <FaAward className="text-purple-400" /> },
    { id: 5, title: "Best Strategy", icon: <FaTrophy className="text-yellow-400" /> },
    { id: 6, title: "Fan Favorite", icon: <FaMedal className="text-blue-400" /> },
    // { id: 7, title: "Rising Star", icon: <FaStar className="text-green-400" /> },
    // { id: 8, title: "Most Improved", icon: <FaAward className="text-purple-400" /> },
  ]);

  return (
    <div
      style={{
        width: "555px",
        height: "100vh",
      }}
      className="inset-0 bg-[#00152993] p-4 hidden xl:flex flex-col h-full w-1/4 rounded-2xl shadow-lg ml-5"
    >
      {/* Achievements Header */}
      <h2 className="text-white text-lg font-semibold mb-4">Achievements</h2>

      {/* Achievements Grid */}
      <motion.div
        className="flex flex-col gap-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      >
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            className="flex items-center justify-center flex-col p-4 bg-[#07325F] rounded-2xl shadow-lg blur transition-all duration-300 hover:shadow-2xl hover:blur-none"
          >
            <div className="flex items-center flex-col">
              {achievement.icon}
              <span className="ml-2 text-white font-semibold">{achievement.title}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Achievements;
