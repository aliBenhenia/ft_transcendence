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
    <div className="">
      {!registeredPlayers ? (
        <form onSubmit={handleSubmit} className='p-4 space-y-4 bg-gray-100 rounded shadow-md'>
          <h2 className="text-lg font-bold">Register Players</h2>
          {players.map((player, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-sm font-medium">Player {index + 1}</label>
              <input
                type="text"
                value={player.alias}
                onChange={(e) => handleAliasChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder={`Enter alias for Player ${index + 1}`}
              />
              <div className="flex items-center space-x-2">
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
                      className={`w-10 h-10 rounded-full border-2 ${
                        player.avatar === avatar ? 'border-blue-500' : 'border-gray-300'
                      }`}
                    />
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">
            Start Tournament
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
