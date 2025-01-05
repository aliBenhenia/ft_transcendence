'use client';

import React from 'react';

interface RegisteredPlayersProps {
  players: { alias: string; avatar: string }[];
}

const RegisteredPlayers: React.FC<RegisteredPlayersProps> = ({ players }) => (
  <div className="max-w-4xl mx-auto p-6 bg-[#06294a] rounded-lg shadow-2xl mb-6">
    <h2 className="text-2xl text-gray-100 font-extrabold text-center mb-6">
      Registered Players
    </h2>
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {players.map((player, index) => (
        <li
          key={index}
          className="flex items-center space-x-4 p-4 bg-gray-700 hover:bg-gray-600 rounded-xl shadow-md transition duration-300 ease-in-out"
        >
          <img
            src={player.avatar}
            alt={`${player.alias}'s avatar`}
            className="w-14 h-14 rounded-full object-cover border-2 border-gray-500"
          />
          <span className="font-semibold text-lg text-gray-200 truncate">
            {player.alias}
          </span>
        </li>
      ))}
    </ul>
  </div>
);

export default RegisteredPlayers;

