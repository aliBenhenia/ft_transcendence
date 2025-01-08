import { useEffect, useState } from "react";

interface NextMatchPopupProps {
  matchInfo: string;
  onClose: () => void;
}

const NextMatchPopup = ({ matchInfo, onClose }: NextMatchPopupProps) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    if (countdown === 0) {
      clearInterval(timer);
      onClose();
    }

    return () => clearInterval(timer);
  }, [countdown, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center pt-8 z-50">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 rounded-lg shadow-2xl transform transition-all duration-300 animate-fade-in scale-up">
        <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-wide mb-4">
          Next Match: {matchInfo}
        </h2>
        <p className="text-white text-lg md:text-xl lg:text-2xl font-medium">
          Starting in <span className="font-bold">{countdown}</span>...
        </p>
      </div>
    </div>
  );
};

export default NextMatchPopup;
