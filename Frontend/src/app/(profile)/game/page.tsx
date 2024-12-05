"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation'


const PingPongGame = () => {
  const [selectedMode, setSelectedMode] = useState<string>("");
  const [selectedBoard, setSlectedBoard] = useState<string>("");
  const router = useRouter();

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMode(event.target.value);
  };

  const handleBoardChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSlectedBoard(event.target.value);
  };

  const handleStartGame = () => {
    if (selectedMode && selectedBoard) {
      router.push(`/game/${selectedMode}?board=${selectedBoard}`);
      // console.log("selectedMode: ", selectedMode, "selectedBoard: ", selectedBoard);
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center">
      <header className="text-center my-8">
        <h1 className=" text-6xl font-bold text-white">Pong Game</h1>
        <p className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-white text-3xl md:text-4xl lg:text-5xl">Challenge <span className='bg-green-600 px-2 text-white rounded-xl'>yourself</span> or your <span className='bg-green-600 px-2 text-white rounded-xl'>friends</span></p>

      </header>

      {/* Cards section */}
      <div className="grid grid-cols-1 gap-8 p-4 md:grid-cols-2">

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
              checked={selectedMode === "offline"}
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
              checked={selectedMode === "online"}
              onChange={handleOptionChange}
              className="form-radio text-blue-600 size-8"
            />
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h1 className="relative w-fit tracking-tight text-balance mb-16 font-bold !leading-tight text-white text-3xl md:text-4xl lg:text-5xl">Choose <span className='bg-green-600 px-2 text-white rounded-xl'>your</span> favorate <span className='bg-green-600 px-2 text-white rounded-xl'>Board</span></h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <label
            className="cursor-pointer bg-red-500 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
          >
            <input
              type="radio"
              name="board"
              value="red"
              checked={selectedBoard === "red"}
              onChange={handleBoardChange}
              className="hidden"
            />
            <span>Red Board</span>
          </label>
          <label
            className="cursor-pointer bg-green-500 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
          >
            <input
              type="radio"
              name="board"
              value="green"
              checked={selectedBoard === "green"}
              onChange={handleBoardChange}
              className="hidden"
            />
            <span>Green Board</span>
          </label>
          <label
            className="cursor-pointer bg-blue-500 text-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
          >
            <input
              type="radio"
              name="board"
              value="blue"
              checked={selectedBoard === "blue"}
              onChange={handleBoardChange}
              className="hidden"
            />
            <span>Blue Board</span>
          </label>
        </div>
      </div>

      {/* Start Game Button */}
      <div className="mt-12">
        <button
          onClick={handleStartGame}
          disabled={!selectedMode || !selectedBoard}
          className={`px-6 py-3 rounded-full font-semibold ${selectedMode && selectedBoard
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
        >
          Start Game
        </button>
      </div>
    </div>
  );
};

export default PingPongGame;