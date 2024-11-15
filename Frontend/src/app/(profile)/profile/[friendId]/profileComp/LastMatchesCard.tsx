"use client";
import { motion } from 'framer-motion';
import { FaTrophy, FaTimesCircle } from 'react-icons/fa';
import { IoMdCheckmarkCircle } from 'react-icons/io';

const matches = [
  {
    opponent: 'Alice',
    date: '2024-09-10',
    result: 'Win',
    score: '3-1',
    avatar: 'https://via.placeholder.com/40',
  },
  {
    opponent: 'Bob',
    date: '2024-09-08',
    result: 'Loss',
    score: '2-3',
    avatar: 'https://via.placeholder.com/40',
  },
  {
    opponent: 'Charlie',
    date: '2024-09-05',
    result: 'Win',
    score: '3-0',
    avatar: 'https://via.placeholder.com/40',
  },
  // Add more match entries if needed
];

const LastMatchesCard = () => {
  return (
    <div
      className="bg-[#00152993] rounded-2xl shadow-lg overflow-hidden mt-5 w-full relative"
      style={{ height: "auto" }}
    >
      {/* Fixed Header */}
      <div className="bg-[#00152993] p-6 w-full">
        <h2 className="text-2xl font-semibold text-white">Last Matches</h2>
      </div>

      <div className="p-6 max-h-[400px] overflow-y-auto">
        <div className="space-y-4">
          {matches.map((match, index) => (
            <div
              key={index}
              className={`p-4 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4 transition-transform duration-300 ease-in-out transform hover:scale-90 hover:bg-opacity-90 ${
                match.result === 'Win' ? 'bg-[#07325F] border-l-4 border-green-500' : 'bg-[#07325F] border-l-4 border-red-500'
              }`}
            >
              {/* Match Date */}
              <div className="absolute top-1 right-4 text-gray-300 text-xs">
                {match.date}
              </div>

              {/* Player 1 */}
              <div className="flex items-center">
                <img
                  className="w-12 h-12 rounded-full mr-4 border-2 border-gray-200"
                  src={match.avatar}
                  alt={`Avatar of ${match.opponent}`}
                />
                <div className="text-white">
                  <div className="text-lg font-semibold">{match.opponent}</div>
                  <div className="text-sm text-gray-400">Opponent</div>
                </div>
              </div>

              {/* Result in Center */}
              <div className="flex items-center space-x-2">
                <div className={`text-2xl font-bold ${match.result === 'Win' ? 'text-green-500' : 'text-red-500'}`}>
                  {match.result === 'Win' ? <FaTrophy /> : <FaTimesCircle />}
                </div>
                <div className="text-white text-lg font-bold">{match.score}</div>
              </div>

              {/* Player 2 (Assuming Player 2 has similar avatar and name) */}
              <div className="flex items-center">
                <img
                  className="w-12 h-12 rounded-full mr-4 border-2 border-gray-200"
                  src={match.avatar}
                  alt={`Avatar of ${match.opponent}`}
                />
                <div className="text-white">
                  <div className="text-lg font-semibold">{match.opponent}</div>
                  <div className="text-sm text-gray-400">Opponent</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LastMatchesCard;
