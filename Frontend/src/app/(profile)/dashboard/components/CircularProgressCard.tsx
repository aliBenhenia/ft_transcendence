import { motion } from 'framer-motion';

const CircularProgressCard = ({ progress }) => {
  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-[#00152993]  pt-4 pb-5 rounded-2xl shadow-2xl text-white max-w-xs mx-auto relative mx-auto max-w-lg mx-auto"
    style ={{maxWidth: '100%', margin: 'auto',marginRight: '10px',}}
    >
       <p className="text-white text-2xl mb-2">Level</p>
      {/* <h6 className="font-bold absolute top-0 left-4">Progress</h6> */}
      <div className="flex flex-col items-center justify-center relative">
        <svg
          className="w-32 h-32"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#4b5563" // Background circle color
            strokeWidth={strokeWidth}
            fill="none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#38bdf8" // Progress color
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-2xl font-bold">{progress}%</h3>
        </div>
      </div>
    </div>
  );
};

export default CircularProgressCard;
