'use client';

import React from 'react';

interface RegisteredPlayersProps {
  players: { alias: string; avatar: string }[];
}

const RegisteredPlayers: React.FC<RegisteredPlayersProps> = ({ players }) => (
  <div>
    <h2 className="text-xl text-white font-bold items-center justify-center flex py-4">Registered Players</h2>
    <ul className="space-4 flex items-center justify-center">
      {players.map((player, index) => (
        <li key={index} className="flex items-center space-x-4 p-4 bg-gray-500 rounded-2xl shadow-md">
          <img src={player.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
          <span className="text-sm font-bold text-white text-lg">{player.alias}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default RegisteredPlayers;
