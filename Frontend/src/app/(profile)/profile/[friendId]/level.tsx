import React from 'react';
interface LevelProgressProps {
  percent: number;
}
const LevelProgress = ({ percent }:LevelProgressProps) => (
  <div className="w-full bg-gray-200 rounded-full h-6 shadow-lg overflow-hidden">
    <div
      className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full flex items-center justify-center"
      style={{ width: `${percent}%` }}
    >
      <span className="text-white font-semibold">{percent}%</span>
    </div>
  </div>
);

export default LevelProgress;
