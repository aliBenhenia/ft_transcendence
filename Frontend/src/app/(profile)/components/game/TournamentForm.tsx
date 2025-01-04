'use client';

import React, { useState } from 'react';
import RegisteredPlayers from './RegisteredPlayers';
import AllMatches from './AllMatches';

interface Player {
  alias: string;
  avatar: string;
}

const avatars = [
  '/avatars/board 1.jpeg',
  '/avatars/board 2.jpeg',
  '/avatars/board 3.avif',
  '/avatars/me.jpeg',
];

const RegistrationForm: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([
    { alias: '', avatar: avatars[0] },
    { alias: '', avatar: avatars[1] },
    { alias: '', avatar: avatars[2] },
    { alias: '', avatar: avatars[3] },
  ]);
  const [registeredPlayers, setRegisteredPlayers] = useState<Player[] | null>(null);
  const [matches, setMatches] = useState<{ player1: Player; player2: Player }[] | null>(null);

  const handleAliasChange = (index: number, value: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].alias = value;
    setPlayers(updatedPlayers);
  };

  const handleAvatarChange = (index: number, avatar: string) => {
    const updatedPlayers = [...players];
    updatedPlayers[index].avatar = avatar;
    setPlayers(updatedPlayers);
  };

  const generateMatches = (players: Player[]) => {
    const matches: { player1: Player; player2: Player }[] = [];
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        matches.push({ player1: players[i], player2: players[j] });
      }
    }
    return matches;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (players.every((p) => p.alias.trim() !== '')) {
      setRegisteredPlayers(players);
      setMatches(generateMatches(players));
    } else {
      alert('All players must have aliases!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#06294a] rounded-lg shadow-lg">
      {!registeredPlayers ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-100 text-center">Register Players</h2>
          {players.map((player, index) => (
            <div key={index} className="space-y-4 bg-gray-800 p-4 rounded-lg shadow-md">
              <label className="block text-lg font-semibold text-gray-200">
                Player {index + 1}
              </label>
              <input
                type="text"
                value={player.alias}
                onChange={(e) => handleAliasChange(index, e.target.value)}
                className="w-full p-3 text-gray-900 rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter alias for Player ${index + 1}`}
              />
              <div className="flex items-center space-x-4">
                {avatars.map((avatar) => (
                  <label key={avatar} className="cursor-pointer">
                    <input
                      type="radio"
                      name={`avatar-${index}`}
                      value={avatar}
                      checked={player.avatar === avatar}
                      onChange={() => handleAvatarChange(index, avatar)}
                      className="hidden"
                    />
                    <img
                      src={avatar}
                      alt="avatar"
                      className={`w-12 h-12 rounded-full border-4 transition ${
                        player.avatar === avatar
                          ? 'border-blue-500 scale-105'
                          : 'border-gray-500'
                      }`}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-500 transition"
          >
            Create Tournament
          </button>
        </form>
      ) : (
        <>
          <RegisteredPlayers players={registeredPlayers} />
          <AllMatches matches={matches!} />
        </>
      )}
    </div>
  );
};

export default RegistrationForm;

