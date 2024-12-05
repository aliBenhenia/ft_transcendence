import Image from "next/image";
interface ScoreboardProps {
  player1Score: number;
  player2Score: number;
  player1Avator: string;
  player2Avator: string;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ player1Score, player2Score, player1Avator, player2Avator }) => {
  return (
    <div className="flex justify-between items-center text-white mb-6">
      <div className="flex flex-col items-center">
        <div className="mb-4">
          <Image 
                src={player1Avator}
                alt="fred rukundo"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full border-2 border-gray-300"
                />
        </div>
        <span className="text-3xl font-bold">{player1Score} /8</span>
      </div>
      <div className="text-3xl font-bold">
        <h1>VS</h1>
      </div>
      <div className="flex flex-col items-center">
        <div className="mb-4">
          <Image
                src={player2Avator}
                alt="Robot AI"
                width={80}
                height={80}
                className="rounded-full border-2 border-gray-300"
                />
        </div>
        <span className="text-3xl font-bold">{player2Score} /8</span>
      </div>
    </div>
  );
};

export default Scoreboard;
