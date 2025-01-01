
'use client';
import { SiProbot } from "react-icons/si";
import { IoGameController } from "react-icons/io5";
import { useState } from "react";
import { useRouter } from "next/navigation";


function PingPongGame() {
  const router = useRouter();
  const [customSettingsEnabled, setCustomSettingsEnabled] = useState<boolean>(false);
  const [scoreToWin, setScoreToWin] = useState<number>(3);
  const [botLevel, setBotLevel] = useState<string>("easy");
  const [selectedMap, setSelectedMap] = useState<string>("Board 1");

  const handleCustomSettings = (enabled: boolean) => {
    setCustomSettingsEnabled(enabled);
    if (!enabled) {
      setScoreToWin(3);
      setBotLevel("easy");
      setSelectedMap("Board 1");
    }
  };
  // const handleStartGame = () => {
  //   router.push("/game/online");
  // };
  const handlePlayWithBot = () => {
    // Prepare settings object
    const settings = customSettingsEnabled
      ? { scoreToWin, botLevel, selectedMap }
      : { scoreToWin: 3, botLevel: "easy", selectedMap: "Board 1" };

    // Pass settings via query parameters
    router.push(
      `/game/offline?scoreToWin=${settings.scoreToWin}&botLevel=${settings.botLevel}&selectedMap=${encodeURIComponent(settings.selectedMap)}`
    );
  };
  const handleStartGame = () => {
    // Prepare settings object
    const settings = customSettingsEnabled
      ? { selectedMap }
      : { selectedMap: "Board 1" };

    // Pass settings via query parameters
    router.push(
      `/game/online?selectedMap=${encodeURIComponent(settings.selectedMap)}`
    );
  };
  return (
    <div className="flex-1 h-screen gap-4 grid grid-cols-1 lg:grid lg:grid-rows-2 lg:grid-cols-2 ">
      {/* Column for Section 1 and Section 2 */}
      <div className=" flex flex-col flex-1 space-y-4 p-4 h-full">
        <div className="bg-blue-50 rounded ">
          <header className="bg-blue-400">
            <h1 className="text-xl text-center text-[#041b34] font-bold">Game Settings</h1>
          </header>
          <div className="my-40">

          <div>
            <h2 className="text-xl text-center py-3 text-[#083b71] font-semibold">Custom Settings</h2>
            <div className="flex justify-center space-x-4">
              <button
                 className={`px-4 py-2 rounded ${!customSettingsEnabled ? "bg-blue-400 text-white" : "bg-gray-200 text-black"}`}
                 onClick={() => handleCustomSettings(false)}
                 >OFF</button>
                 <button
                  className={`px-4 py-2 rounded ${customSettingsEnabled ? "bg-blue-400 text-white" : "bg-gray-200 text-black"}`}
                  onClick={() => handleCustomSettings(true)}
                >
                  ON
                </button>
            </div>
          </div>
          <div className={customSettingsEnabled ? "" : "pointer-events-none opacity-50"}>
            <h2 className="text-xl text-center py-3 text-[#083b71] font-semibold">Score to win</h2>
            <div className="flex justify-center space-x-4">
              {[3, 5, 8, 10].map((score) => (
                  <button
                    key={score}
                    className={`px-4 py-2 rounded ${scoreToWin === score ? "bg-blue-400 text-white" : "bg-gray-200 text-black"}`}
                    onClick={() => customSettingsEnabled && setScoreToWin(score)}
                  >
                    {score}
                  </button>
                ))}
            </div>
          </div>
          <div className={customSettingsEnabled ? "" : "pointer-events-none opacity-50"}>
            <h2 className="text-xl text-center py-3 text-[#083b71] font-semibold">Bot level (for bot game only)</h2>
            <div className="flex justify-center space-x-4">
              {["easy", "medium", "hard"].map((level) =>(
                <button
                  key={level}
                  className={`px-4 py-2 rounded ${botLevel === level ? "bg-blue-400 text-white" : "bg-gray-200 text-black"}`}
                  onClick={() => customSettingsEnabled && setBotLevel(level)}
                  >
                  {level}
                  </button>
              ))}
            </div>
          </div>
          </div>
        </div>
        <div className="bg-blue-50 rounded ">
          <header className="bg-blue-300">
            <h1 className="text-xl text-center text-[#041b34] font-bold">Maps</h1>
          </header>
          <div>
            <h2 className="text-center text-xl mb-4 font-semibold text-[#083b71] mt-3">Choose your favorite Map</h2>
            <div className={`grid grid-cols-1 gap-4 m-9 md:grid-cols-2 lg:grid-cols-3 ${customSettingsEnabled ? "" : "pointer-events-none opacity-50"}`}>
            {[
                { name: "Board 1", url: "/board 1.jpeg" },
                { name: "Board 2", url: "/board 2.jpeg" },
                { name: "Board 3", url: "/board 3.avif" },
              ].map((map) => (
                <div
                  key={map.name}
                  className={`w-full h-48 rounded bg-cover bg-center relative cursor-pointer ${selectedMap === map.name ? "ring-4 ring-blue-400" : ""}`}
                  style={{ backgroundImage: `url('${map.url}')` }}
                  onClick={() => customSettingsEnabled && setSelectedMap(map.name)}
                >
                  <div className="absolute bottom-0 w-full bg-black bg-opacity-50 text-white text-center py-2 rounded-b">
                    {map.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>


      </div>
      {/* Column for Section 3 and section 4*/}
      <div className=" flex flex-col flex-1 p-4 min-h-screen space-y-4">
        <div className="bg-blue-50 rounded h-2/3 ">
          <header className="bg-blue-400">
            <h1 className="text-xl text-center text-[#041b34] font-bold">Friends</h1>
          </header>
          <div>
            <h2 className="text-center text-gray-400 p-6">you haven't add any friends yet!</h2>

          </div>
        </div>
        <div className="flex flex-col items-center  space-y-4 p-4 h-1/5">
          <div>
            {/* Start Game Button */}
            <button
              className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-3 rounded-lg flex justify-center items-center gap-2 shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-800 active:shadow-inner transition duration-200"
           onClick={handleStartGame}
           >
              <IoGameController className="text-xl" />
              <span className="text-lg font-semibold">Start Game</span>
            </button>
          </div>
          <div>
            {/* Play with Bot Button */}
            <button
              className="bg-gradient-to-r from-green-500 to-green-700 text-white p-3 rounded-lg flex justify-center items-center gap-2 shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-800 active:shadow-inner transition duration-200"
              onClick={handlePlayWithBot}
            >
              <SiProbot className="text-xl" />
              <span className="text-lg font-semibold">Play with Botss</span>
            </button>
          </div>
        </div>


      </div>

    </div>
  );
}

export default PingPongGame;
