'use client';

import React from 'react';

interface Match {
  player1: { alias: string; avatar: string };
  player2: { alias: string; avatar: string };
}

interface AllMatchesProps {
  matches: Match[];
}

const AllMatches: React.FC<AllMatchesProps> = ({ matches }) => (
  <div className="max-w-3xl mx-auto p-6 bg-[#06294a] rounded-lg shadow-2xl mt-5">
    <h2 className="text-2xl text-gray-100 font-extrabold text-center mb-6">
      All Matches to be played
    </h2>
    <ul className="space-y-4">
      {matches.map((match, index) => (
        <li
          key={index}
          className="flex items-center justify-between p-4 bg-gray-700 hover:bg-gray-600 rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          <div className="flex items-center space-x-4">
            <img
              src={match.player1.avatar}
              alt={`${match.player1.alias}'s avatar`}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-500"
            />
            <span className="text-lg font-medium text-gray-200 truncate">
              {match.player1.alias}
            </span>
          </div>
          <span className="text-lg font-semibold text-red-400">vs</span>
          <div className="flex items-center space-x-4">
            <img
              src={match.player2.avatar}
              alt={`${match.player2.alias}'s avatar`}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-500"
            />
            <span className="text-lg font-medium text-gray-200 truncate">
              {match.player2.alias}
            </span>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

export default AllMatches;
