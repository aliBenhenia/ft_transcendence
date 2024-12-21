"use client";

import React, { useEffect, useRef, useState } from "react";
import { createWebSocketConnection } from "@/utils/websocket";
import { GameState, Direction } from "@/utils/typess";
import { useRouter } from "next/navigation";

const WINNING_SCORE = 5;

const WaitingIndicator: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="loader mb-4"></div>
    <p className="text-xl font-bold text-white">Waiting for another player...</p>
  </div>
);


const GameCanvas: React.FC = () => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isWaiting, setIsWaiting] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [gameResult, setGameResult] = useState({ message: '', finalScore: [0, 0] });

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("No access token found in localStorage");
      return;
    }

    const websocket = createWebSocketConnection(accessToken);
    setWs(websocket);

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "game_state") {
        console.log("Game state: ", data.game_state);
        setGameState(data.game_state);
        setIsWaiting(false);

        if (data.game_state.score[0] === WINNING_SCORE) {
          setWinner("Player 1");
          setGameOver(true);
        } else if (data.game_state.score[1] === WINNING_SCORE) {
          setWinner("Player 2");
          setGameOver(true);
        }
      } else if (data.type === "waiting") {
        setIsWaiting(true);
      }
      else if (data.type === 'game_ends') {
        setGameOver(true);
        setGameResult({
          message: data.message,
          finalScore: data.final_score,
        });
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, []);

  useEffect(() => {
    if (gameState && canvasRef.current) {
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

      // Draw scores
      ctx.font = "20px Arial";
      ctx.fillText(gameState.score[0].toString(), canvasRef.current.width / 4, 30);
      ctx.fillText(gameState.score[1].toString(), (canvasRef.current.width * 3) / 4, 30);
    }
  }, [gameState]);

  const handleKeyDown = (e: KeyboardEvent) => {
    const direction: Direction = e.key as Direction;
    if (ws && (direction === "ArrowUp" || direction === "ArrowDown")) {
      ws.send(JSON.stringify({ action: "move", direction }));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [ws]);

  const leaveGame = () => {
    if (ws) {
      ws.close();
      console.log("Left the game.");
    }
    setGameOver(true);
    setWinner("You left the game.");
    router.push("/game");
  };
  const leaveGame2 = () => {
    if (ws) {
      ws.close();
      console.log("Left the game.");
    }
    setGameOver(true);
    setWinner("You left the game.");
    setTimeout(() => {
      router.push("/game");
    }, 1000);
  };
  const handleRestart = () => {
    setGameOver(false);
    setGameResult({ message: '', finalScore: [0, 0] });
    window.location.reload();
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {isWaiting ? (
        <WaitingIndicator />
      ) : (
        <div className="relative w-full max-w-4xl aspect-w-16 aspect-h-9 border-2 rounded-lg shadow-lg">
          <canvas
            ref={canvasRef}
            width={800}
            height={400}
            className="w-full h-full bg-[#07325F] border-2 border-white rounded-lg"
          ></canvas>
          {gameOver && gameResult.message && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-4xl font-bold text-white mb-4">{gameResult.message}</p>
              <p className="text-2xl text-white">Final Score: {gameResult.finalScore[0]} : {gameResult.finalScore[1]}</p>
                <button
                  onClick={leaveGame}
                  className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 mt-4"
                >
                  Leave Game
                </button>

                <button
                  onClick={handleRestart}
                  className="px-6 py-2 bg-[#008000] text-white font-bold rounded-lg hover:bg-[#006400] ml-4"
                >
                  Restart Game
                </button>
            </div>
          )}
        </div>
      )}
      {!gameOver && (
        <button
          onClick={leaveGame2}
          className="absolute bottom-8 right-8 px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-700"
        >
          Leave
        </button>
      )}
    </div>
  );
};

export default GameCanvas;
