'use client';

import React, { useState, useEffect } from 'react';
import RegisteredPlayers from './RegisteredPlayers';
import AllMatches from './AllMatches';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([
    { alias: '', avatar: avatars[0] },
    { alias: '', avatar: avatars[1] },
    { alias: '', avatar: avatars[2] },
    { alias: '', avatar: avatars[3] },
  ]);
  const [registeredPlayers, setRegisteredPlayers] = useState<Player[] | null>(null);
  const [matches, setMatches] = useState<{ player1: Player; player2: Player }[] | null>(null);

// function to save the registered players and matches in the local storage
  useEffect(() => {
    const savedPlayers = localStorage.getItem('registeredPlayers');
    const savedMatches = localStorage.getItem('matches');
    if (savedPlayers) {
      setRegisteredPlayers(JSON.parse(savedPlayers));
    }
    if (savedMatches) {
      setMatches(JSON.parse(savedMatches));
    }
  }, []);

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

  // match making system
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
  
    // Check for empty aliases
    if (players.some((p) => p.alias.trim() === '')) {
      alert('All players must have aliases!');
      return;
    }
  
    // Check for duplicate aliases
    const aliases = players.map((p) => p.alias.trim().toLowerCase());
    const hasDuplicates = aliases.some((alias, index) => aliases.indexOf(alias) !== index);
  
    if (hasDuplicates) {
      alert('Each player must have a unique alias!');
      return;
    }
  
    // Save players and matches
    setRegisteredPlayers(players);
    setMatches(generateMatches(players));
    localStorage.setItem('registeredPlayers', JSON.stringify(players));
    localStorage.setItem('matches', JSON.stringify(generateMatches(players)));
  };
  // function to end the tournament
  const handleEndTournament = () => {
    setRegisteredPlayers(null);
    setMatches(null);
    localStorage.removeItem('registeredPlayers');
    localStorage.removeItem('matches');
  };
  // function to start the tournament
  const handleStartTournament = () => {
    router.push('/game/TournamentGame');

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

          <button
  onClick={handleStartTournament}
  className={`w-full py-3 text-white text-lg font-semibold rounded-lg transition ${
    matches && matches.length > 0
      ? 'bg-blue-600 hover:bg-blue-500'
      : 'bg-gray-400 cursor-not-allowed'
  }`}
  disabled={!matches || matches.length === 0}
>
  Start Tournament
</button>
          <button
            onClick={handleEndTournament}
            className="mt-4 w-full py-3 bg-red-600 text-white text-lg font-semibold rounded-lg hover:bg-red-500 transition"
          >
            Delete Tournament
          </button>
        </>
      )}
    </div>
  );
};

export default RegistrationForm;

