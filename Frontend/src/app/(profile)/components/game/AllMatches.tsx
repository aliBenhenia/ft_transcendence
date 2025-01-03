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
  <div>
    <h2 className="mt-4 text-lg font-bold text-white pb-4">All Matches</h2>
    <ul className="space-y-2">
      {matches.map((match, index) => (
        <li key={index} className="flex items-center space-x-4">
          <img src={match.player1.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
          <span className="text-sm font-medium text-white">{match.player1.alias}</span>
          <span className="text-sm font-medium text-red-400">vs</span>
          <img src={match.player2.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
          <span className="text-sm font-medium text-white">{match.player2.alias}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default AllMatches;
