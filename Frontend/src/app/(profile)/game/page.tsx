"use client";
import { useState } from "react";


const PingPongGame = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };
  
  return (
    <div className="relative flex flex-col items-center justify-center">
      <header className="text-center my-8">
        <h1 className=" text-6xl font-bold text-white">Pong Game</h1>
        <p className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-white text-3xl md:text-4xl lg:text-5xl">Challenge <span className='bg-green-600 px-2 text-white rounded-xl'>yourself</span> or your <span className='bg-green-600 px-2 text-white rounded-xl'>friends</span></p>

      </header>

      {/* Cards section */}
      <div className= "grid grid-cols-1 gap-8 p-4 md:grid-cols-2">

      <div
          className="bg-[#bae6fd] text-gray-900
                    rounded-xl 
                    shadow-lg p-16
                    flex flex-col items-center hover:shadow-2xl transition transform hover:scale-105 bg-cover"
          style={{
            backgroundImage: "url('/two.png')",
            justifyContent: "space-between",
          }}
        >
          <h2 className="text-2xl font-semibold mb-2">Practice Offline</h2>
          <p className="text-center mb-4">
           play against the AI bot.
          </p>
          <div className="flex items-center">
            <input
              type="radio"
              name="gameMode"
              value="offline"
              checked={selectedOption === "offline"}
              onChange={handleOptionChange}
              className="form-radio text-blue-600 size-8"
            />
           
          </div>
        </div>
        <div
          className="bg-[#bae6fd] text-gray-900
        rounded-xl 
        shadow-lg p-16
        flex flex-col items-center hover:shadow-2xl transition transform hover:scale-105 bg-cover"
          style={{
            backgroundImage: "url('/two.png')",
            justifyContent: "space-between",
          }}
        >
          <h2 className="text-2xl font-semibold mb-2">Play with Friends</h2>
          <p className="text-center mb-4">
            Invite a friend for an exciting 1v1 match
          </p>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              name="gameMode"
              value="online"
              checked={selectedOption === "online"}
              onChange={handleOptionChange}
              className="form-radio text-blue-600 size-8"
            />
          </div>
        </div>
      </div>
     <div>
      <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-white text-3xl md:text-4xl lg:text-5xl">Choose <span className='bg-green-600 px-2 text-white rounded-xl'>your</span> favorate <span className='bg-green-600 px-2 text-white rounded-xl'>Board</span></h1>
     </div>
    </div>
  );
};

export default PingPongGame;