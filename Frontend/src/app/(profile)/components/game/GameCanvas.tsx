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
    <p className="text-xl font-bold text-white">
      Waiting for another player...
    </p>
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
  const room_name: any = useSearchParams().get("room_name");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isSearching, setIsSearching] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState({
    message: "",
    finalScore: [0, 0],
  });
  const [players, setPlayers] = useState({
    player1: { username: "", avatar: "" },
    player2: { username: "", avatar: "" },
  });
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  const mapBackgroundImage: Record<string, string> = {
    "Board 1": "/board 1.jpeg",
    "Board 2": "/board 2.jpeg",
    "Board 3": "/board 3.avif",
  };
  const backgroundImage = mapBackgroundImage[selectedMap] || "/board 1.jpeg";

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No access token found.");
      router.push("/");
      return;
    }

    const websocket = createWebSocketConnection(accessToken, room_name);
    setWs(websocket);

    const handleWebSocketMessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "timeout":
          message.error(data?.message);
          router.push("/chat");
          break;
        case "game_accepted":
          message.success(data?.message);
          break;
        case "game_rejected":
          message.error(data?.message);
          router.push("/chat");
          break;
        case "unauthorized":
          localStorage.removeItem("accessToken");
          router.push("/");
          break;
        case "close":
          message.error(data?.message);
          websocket.close();
          router.push("/game");
          break;
        case "invalid_room":
          message.error(data?.message);
          router.push("/game");
          break;
        case "game_start":
          setPlayers({
            player1: {
              username: data.player1_username,
              avatar: data.player1_avatar,
            },
            player2: {
              username: data.player2_username,
              avatar: data.player2_avatar,
            },
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
          break;
        case "searching":
          setIsSearching(true);
          break;
        case "searching_expanded":
          setIsSearching(true);
          break;
        case "no_opponent":
          setTimeoutReached(true);
          break;
        default:
          break;
      }
    };

    websocket.onmessage = handleWebSocketMessage;
    websocket.onerror = (error) => console.error("WebSocket error:", error);

    return () => {
      websocket.close();
    };
  }, [room_name, router]);

  useEffect(() => {
    if (!gameState || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(gameState.ballX, gameState.ballY, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillRect(10, gameState.player1Y, 10, 100);
    ctx.fillRect(canvasRef.current.width - 20, gameState.player2Y, 10, 100);
  }, [gameState]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!ws) return;

    const direction: Direction = e.key as Direction;
    if (direction === "ArrowUp" || direction === "ArrowDown") {
      setKeysPressed((prev) => new Set(prev).add(direction));
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    const direction: Direction = e.key as Direction;
    if (direction === "ArrowUp" || direction === "ArrowDown") {
      setKeysPressed((prev) => {
        const newKeys = new Set(prev);
        newKeys.delete(direction);
        return newKeys;
      });
    }
  };

  useEffect(() => {
    const moveInterval = setInterval(() => {
      if (!ws || keysPressed.size === 0) return;

      keysPressed.forEach((direction) => {
        ws.send(JSON.stringify({ action: "move", direction }));
      });
    }, 16);

    return () => clearInterval(moveInterval);
  }, [ws, keysPressed]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [ws]);

  const leaveGame = () => {
    ws?.send(JSON.stringify({ action: "leave" }));
    ws?.close();
    const path = room_name ? "/chat" : "/game";
    router.push(path);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen">
        {timeoutReached ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-xl font-bold text-red-600">
              Timeout! No opponent joined.
            </p>
            <button
              onClick={leaveGame}
              className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 mt-4"
            >
              Leave Game
            </button>
          </div>
        ) : isSearching || waiting ? (
          isSearching ? (
            <SearchingIndicator />
          ) : (
            <WaitingIndicator />
          )
        ) : (
          <div className="relative p-6 aspect-w-16 aspect-h-9">
            {!gameOver && (
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
            )}
            {!gameOver && (
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full bg-cover bg-center border-2 rounded-lg"
                style={{
                  backgroundImage: `url('${backgroundImage}')`,
                  backgroundColor: "#07325F",
                }}
              ></canvas>
            )}
            {gameOver && gameResult && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[800px] h-[500px] bg-black/20 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="text-center py-8">
                      <h2 className="text-4xl font-bold text-white">
                        Game Over
                      </h2>
                    </div>

                    {/* Players Container */}
                    <div className="flex justify-between items-center flex-1 px-32 space-x-16">
                      {/* Player 1 */}
                      <div className="flex flex-col items-center space-y-8">
                        <div className="h-12 flex items-end justify-center">
                          {gameResult.finalScore[0] > gameResult.finalScore[1] && (
                            <div className="text-5xl animate-bounce">👑</div>
                          )}
                        </div>
                        <div className="relative">
                          <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-white/30 
                                    shadow-lg transition-transform hover:scale-105 duration-300">
                            <img
                              src={players.player1.avatar || "/default-avatar.png"}
                              alt={players.player1.username}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {gameResult.finalScore[0] > gameResult.finalScore[1] && (
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                              <span className="px-4 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                                Winner!
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-center space-y-2">
                          <p className="text-xl font-bold text-white">
                            {players.player1.username}
                          </p>
                          <p className="text-6xl font-black text-white">
                            {gameResult.finalScore[0]}
                          </p>
                        </div>
                      </div>

                      {/* Player 2 */}
                      <div className="flex flex-col items-center space-y-8">
                        <div className="h-12 flex items-end justify-center">
                          {gameResult.finalScore[1] > gameResult.finalScore[0] && (
                            <div className="text-5xl animate-bounce">👑</div>
                          )}
                        </div>
                        <div className="relative">
                          <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-white/30 
                                    shadow-lg transition-transform hover:scale-105 duration-300">
                            <img
                              src={players.player2.avatar || "/default-avatar.png"}
                              alt={players.player2.username}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {gameResult.finalScore[1] > gameResult.finalScore[0] && (
                            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                              <span className="px-4 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                                Winner!
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-center space-y-2">
                          <p className="text-xl font-bold text-white">
                            {players.player2.username}
                          </p>
                          <p className="text-6xl font-black text-white">
                            {gameResult.finalScore[1]}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer with Leave Game Button */}
                    <div className="text-center py-8">
                      <button
                        onClick={leaveGame}
                        className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl
                               transform hover:scale-105 transition-all shadow-lg hover:shadow-red-500/25"
                      >
                        Leave Game
                      </button>
                    </div>
                  </div>
                </div>
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
    </>
  );
};

export default GameCanvas;
