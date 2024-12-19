'use client';
import React, {useEffect, useRef, useState} from "react";
import { createWebSocketConnection } from "@/utils/websocket";
import { GameState, Direction } from "@/utils/typess";

const WaitingIndicator: React.FC = () => (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="loader mb-4"></div>
      <p className="text-xl font-bold text-white">Waiting for another player...</p>
    </div>
  );
  
  const GameCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [isWaiting, setIsWaiting] = useState(true); // Waiting state
  
    useEffect(() => {
      const accestoken = localStorage.getItem("accessToken");
      if (!accestoken) {
        console.error("No access token found in localStorage");
        return;
      }
  
      const websocket = createWebSocketConnection(accestoken);
      setWs(websocket);
  
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "game_state") {
          setGameState(data.game_state);
          setIsWaiting(false); // Stop waiting when the game state is received
        } else if (data.type === "waiting") {
          console.log(data.message);
          setIsWaiting(true); // Show waiting state if still waiting
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
  
        ctx.clearRect(0, 0, 800, 400);
  
        // Draw ball
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(gameState.ballX, gameState.ballY, 10, 0, Math.PI * 2);
        ctx.fill();
  
        // Draw paddles
        ctx.fillRect(10, gameState.player1Y, 10, 100);
        ctx.fillRect(780, gameState.player2Y, 10, 100);
  
        // Draw scores
        ctx.font = "20px Arial";
        ctx.fillText(gameState.score[0].toString(), 300, 30);
        ctx.fillText(gameState.score[1].toString(), 500, 30);
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
  
    return (
      <div className="relative w-full h-full">
        {isWaiting ? (
          <WaitingIndicator />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="bg-black border border-gray-700"
              />
          </div>
        )}
      </div>
    );
  };
  
  export default GameCanvas;