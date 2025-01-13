// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { createWebSocketConnection } from "@/utils/websocket";
// import { GameState, Direction } from "@/utils/typess";
// import { useRouter, useSearchParams } from "next/navigation";
// import Scoreboards from "../tournaments/Scoreboard";

// const WINNING_SCORE = 5;

// const WaitingIndicator: React.FC = () => (
//   <div className="flex flex-col items-center justify-center h-full">
//     <div className="loader mb-4"></div>
//     <p className="text-xl font-bold text-white">Waiting for another player...</p>
//   </div>
// );
// const SearchingIndicator: React.FC = () => (
//   <div className="flex flex-col items-center justify-center h-full">
//     <div className="loader mb-4"></div>
//     <p className="text-xl font-bold text-white">Searching for an opponent...</p>
//   </div>
// );

// const GameCanvas: React.FC = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const selectedMap = searchParams.get("selectedMap") || "Board 1";
//   const room_name: any = useSearchParams().get('room_name');

//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [gameState, setGameState] = useState<GameState | null>(null);
//   const [ws, setWs] = useState<WebSocket | null>(null);
//   const [isSearching, setIsSearching] = useState(true);
//   const [gameOver, setGameOver] = useState(false);
//   const [gameResult, setGameResult] = useState({ message: "", finalScore: [0, 0] });
//   const [players, setPlayers] = useState({
//     player1: { username: "", avatar: "" },
//     player2: { username: "", avatar: "" },
//   });
//   const [timeoutReached, setTimeoutReached] = useState(false);

//   // Map a selectedMap value to image URLS
//   const mapBackgroundImage: Record<string, string> = {
//     'Board 1': '/board 1.jpeg',
//     'Board 2': '/board 2.jpeg',
//     'Board 3': '/board 3.avif',
//   };
//   const backgroundImage = mapBackgroundImage[selectedMap] || '/board 1.jpeg';

//   useEffect(() => {
//     const accessToken = localStorage.getItem("accessToken");
//     if (!accessToken) {
//       console.error("No access token found.");
//       return;
//     }

//     const websocket = createWebSocketConnection(accessToken, room_name);
//     setWs(websocket);

//     websocket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       handleWebSocketMessage(data);
//     };

//     websocket.onerror = (error) => console.error("WebSocket error:", error);

//     return () => {
//       websocket.close();
//     };
//   }, [room_name]);

//   const handleWebSocketMessage = (data: any) => {
//     switch (data.type) {
//       case "game_start":
//         setPlayers({
//           player1: { username: data.player1_username, avatar: data.player1_avatar },
//           player2: { username: data.player2_username, avatar: data.player2_avatar },
//         });
//         setGameState(data.game_state);
//         setIsSearching(false);
//         setGameOver(false);
//         setTimeoutReached(false);
//         break;
//       case "game_state":
//         setGameState(data.game_state);
//         setTimeoutReached(false);
//         setIsSearching(false);
//         break;
//       case "game_ends":
//         setGameOver(true);
//         setGameResult({
//           message: data.message,
//           finalScore: data.final_score || [0, 0],
//         });
//         break;
//       case "searching":
//         setIsSearching(true);
//         console.log("Searching for an opponent...");
//         break;
//       case "searching_expanded":
//         setIsSearching(true);
//         console.log("Searching expanded");
//         break;
//       case "No_opponent":
//         setTimeoutReached(true); // Trigger timeout behavior
//         console.log("No opponent found.");
//         break;
//       default:
//         console.warn("Unknown WebSocket message type:", data.type);
//     }
//   };

//   useEffect(() => {
//     if (!gameState || !canvasRef.current) return;

//     const ctx = canvasRef.current.getContext("2d");
//     if (!ctx) return;

//     ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//     ctx.fillStyle = "white";

//     // Draw ball
//     ctx.beginPath();
//     ctx.arc(gameState.ballX, gameState.ballY, 10, 0, Math.PI * 2);
//     ctx.fill();

//     // Draw paddles
//     ctx.fillRect(10, gameState.player1Y, 10, 100);
//     ctx.fillRect(canvasRef.current.width - 20, gameState.player2Y, 10, 100);
//   }, [gameState]);

//   const handleKeyDown = (e: KeyboardEvent) => {
//     if (!ws) return;

//     const direction: Direction = e.key as Direction;
//     if (direction === "ArrowUp" || direction === "ArrowDown") {
//       ws.send(JSON.stringify({ action: "move", direction }));
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [ws]);

//   const leaveGame = () => {
//     ws?.close();
//     setGameOver(true);
//     router.push("/game");
//   };
//   const leaveGame2 = () => {
//     ws?.close();
//     setGameOver(true);
//     router.push("/game");
//   };
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       {timeoutReached ? (
//         <div className="flex flex-col items-center justify-center h-full">
//           <p className="text-xl font-bold text-red-600">Timeout! No opponent joined.</p>
//           <button
//             onClick={leaveGame}
//             className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 mt-4"
//           >
//             Leave Game
//           </button>
//         </div>
//       ) : (
//         <SearchingIndicator />
//       )}
//       {gameState && (
//          <div className="relative border-2 rounded-lg shadow-lg p-6 aspect-w-16 aspect-h-9">
//          <div >
//            <Scoreboards
//              player1={{
//                alias: players.player1.username || 'Player 1',
//                avatar: players.player1.avatar || '/board1.jpeg',
//              }}
//              player2={{
//                alias: players.player2.username || 'Player 2',
//                avatar: players.player2.avatar || '/board1.jpeg',
//              }}
//              player1Score={gameState?.score[0] || 0}
//              player2Score={gameState?.score[1] || 0}
//            />
//          </div>
//          <canvas
//            ref={canvasRef}
//            width={800}
//            height={400}
//            className="w-full bg-cover bg-center border-2 rounded-lg"
//            style={{
//              backgroundImage: `url('${backgroundImage}')`,
//              backgroundColor: '#07325F',
//            }}
//          ></canvas>
//          {gameOver && gameResult && (
//            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
//              <p className="text-4xl font-bold text-white mb-4">{gameResult.message}</p>
//              <p className="text-2xl text-white">Final Score: {gameResult.finalScore[0]} : {gameResult.finalScore[1]}</p>
//              <button
//                onClick={leaveGame}
//                className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 mt-4"
//              >
//                Leave Game
//              </button>
//            </div>
//          )}
//          </div> 
//       )}
//       {!gameOver && (
//         <button
//           onClick={leaveGame2}
//           className="absolute bottom-8 right-8 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-700"
//         >
//           Leave
//         </button>
//       )}
//     </div>
//   );
// };

// export default GameCanvas;

"use client";

import React, { useEffect, useRef, useState } from "react";
import { createWebSocketConnection } from "@/utils/websocket";
import { GameState, Direction } from "@/utils/typess";
import { useRouter, useSearchParams } from "next/navigation";
import Scoreboards from "../tournaments/Scoreboard";
import { message } from "antd"; 


const WINNING_SCORE = 5;

const WaitingIndicator: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="loader mb-4"></div>
    <p className="text-xl font-bold text-white">Waiting for another player...</p>
  </div>
);

const SearchingIndicator: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="loader mb-4"></div>
    <p className="text-xl font-bold text-white">Searching for an opponent...</p>
  </div>
);

const GameCanvas: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedMap = searchParams.get("selectedMap") || "Board 1";
  const room_name: any = useSearchParams().get('room_name');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isSearching, setIsSearching] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState({ message: "", finalScore: [0, 0] });
  const [players, setPlayers] = useState({
    player1: { username: "", avatar: "" },
    player2: { username: "", avatar: "" },
  });
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [waiting, setWaiting] = useState(false);


  const mapBackgroundImage: Record<string, string> = {
    "Board 1": "/board 1.jpeg",
    "Board 2": "/board 2.jpeg",
    "Board 3": "/board 3.avif",
  };
  const backgroundImage = mapBackgroundImage[selectedMap] || "/board 1.jpeg";

  // WebSocket setup
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No access token found.");
      router.push("/login");
      return;
    }

    const websocket = createWebSocketConnection(accessToken, room_name);
    setWs(websocket);

    const handleWebSocketMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      console.log("backend message :", data?.message);

      switch (data.type) {
        case "timeout":
          console.log("timeout reached")
          // setTimeoutReached(true);
          message.error(data?.message);
          router.push('/chat');
          // setTimeout(() => router.push('/chat'), 1000);
          break ;
        case "game_rejected":
          message.error(data?.message);
          router.push('/chat');
          break ;

        case 'close':
          // console.log('')
          message.error(data?.message);
          websocket.close();
          router.push('/game');
          break ;
        case "invalid_room":
          message.error(data?.message);
          router.push('/game');
          break ;

        case "game_start":
          setPlayers({
            player1: { username: data.player1_username, avatar: data.player1_avatar },
            player2: { username: data.player2_username, avatar: data.player2_avatar },
          });
          setGameState(data.game_state);
          setIsSearching(false);
          setGameOver(false);
          setTimeoutReached(false);
          setWaiting(false);
          break;

        case "game_state":
          setGameState(data.game_state);
          setTimeoutReached(false);
          setIsSearching(false);
          setWaiting(false);
          break;

        case "game_ends":
          setGameOver(true);
          setGameResult({
            message: data.message,
            finalScore: data.final_score || [0, 0],
          });
          break;
        case "waiting":
          setWaiting(true);
          setIsSearching(false);
          break ;
          
        case "searching":
          setIsSearching(true);
          console.log("Searching for an opponent...");
          break;
        case "searching_expanded":
          setIsSearching(true);
          console.log("Searching expanded");
          break;

        case "no_opponent":
          setTimeoutReached(true);
          console.log("No opponent found.");
          break;

        default:
          console.warn("Unknown WebSocket message type:", data.type);
      }
    };

    websocket.onmessage = handleWebSocketMessage;
    websocket.onerror = (error) => console.error("WebSocket error:", error);

    return () => {
      websocket.close();
    };
  }, [room_name, router]);

  // Game rendering logic
  useEffect(() => {
    if (!gameState || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = "white";

    // Draw ball
    ctx.beginPath();
    ctx.arc(gameState.ballX, gameState.ballY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Draw paddles
    ctx.fillRect(10, gameState.player1Y, 10, 100);
    ctx.fillRect(canvasRef.current.width - 20, gameState.player2Y, 10, 100);
  }, [gameState]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!ws) return;

    const direction: Direction = e.key as Direction;
    if (direction === "ArrowUp" || direction === "ArrowDown") {
      ws.send(JSON.stringify({ action: "move", direction }));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ws]);

  const leaveGame = () => {
    ws?.close();
    const path = room_name ? "/chat" : "/game";
    router.push(path);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {timeoutReached ? (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-xl font-bold text-red-600">Timeout! No opponent joined.</p>
          <button
            onClick={leaveGame}
            className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 mt-4"
          >
            Leave Game
          </button>
        </div>
      ) : (isSearching || waiting) ? (
         isSearching ? <SearchingIndicator /> : <WaitingIndicator />
      ) : (
        <div className="relative border-2 rounded-lg shadow-lg p-6 aspect-w-16 aspect-h-9">
          <Scoreboards
            player1={{
              alias: players.player1.username || "Player 1",
              avatar: players.player1.avatar || "/board1.jpeg",
            }}
            player2={{
              alias: players.player2.username || "Player 2",
              avatar: players.player2.avatar || "/board1.jpeg",
            }}
            player1Score={gameState?.score[0] || 0}
            player2Score={gameState?.score[1] || 0}
          />
          {!gameOver && <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full bg-cover bg-center border-2 rounded-lg"
            style={{
              backgroundImage: `url('${backgroundImage}')`,
              backgroundColor: "#07325F",
            }}
          ></canvas>}
          {gameOver && gameResult && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-4xl font-bold text-white mb-4">{gameResult.message}</p>
              <p className="text-2xl text-white">
                Final Score: {gameResult.finalScore[0]} : {gameResult.finalScore[1]}
              </p>
              <button
                onClick={leaveGame}
                className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 mt-4"
              >
                Leave Game
              </button>
            </div>
          )}
        </div>
      )}
      {!gameOver && !timeoutReached && (
        <button
          onClick={leaveGame}
          className="absolute bottom-8 right-8 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-700"
        >
          Leave
        </button>
      )}
    </div>
  );
};

export default GameCanvas;
