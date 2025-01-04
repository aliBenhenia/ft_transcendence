'use client';
import Image from "next/image";

interface ScoreboardProps {
  player1: { alias: string; avatar: string };
  player2: { alias: string; avatar: string };
  player1Score: number;
  player2Score: number;
}

const Scoreboards: React.FC<ScoreboardProps> = ({
  player1,
  player2,
  player1Score,
  player2Score,
}) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex items-center space-x-2">
        <img src={player1.avatar} alt="Player 1 Avatar" className="w-10 h-10 rounded-full" />
        <span>{player1.alias}</span>
      </div>
      <div>
        <span>{player1Score}</span> - <span>{player2Score}</span>
      </div>
      <div className="flex items-center space-x-2">
        <span>{player2.alias}</span>
        <img src={player2.avatar} alt="Player 2 Avatar" className="w-10 h-10 rounded-full" />
      </div>
    </div>
  );
};


export default Scoreboards;