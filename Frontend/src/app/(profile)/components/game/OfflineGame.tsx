'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Scoreboard from './Scoreboard';
import { Ball, Paddle, checkCollisions } from '@/utils/bot';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

const user1 = {
  avatar: '/me.jpeg',
};

const user2 = {
  avatar: '/bot.jpg',
};

// Function to draw a dashed line on the canvas
function drawDashedLine(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  const centerX = canvas.width / 2;
  ctx.setLineDash([10, 15]);
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height);
  ctx.stroke();
}

const Ai = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const scoreToWin = searchParams.get('scoreToWin') || '3';
  const botLevel = searchParams.get('botLevel') || 'easy';
  const selectedMap = searchParams.get('selectedMap') || 'Board 1';

  const cleanedBotLevel = botLevel.trim();

  const level = cleanedBotLevel === 'easy' ? 2 :
                cleanedBotLevel === 'medium' ? 3 : 
                cleanedBotLevel === 'hard' ? 5 : 2;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(3);
  const [paused, setPaused] = useState(false);
  const animationFrameId = useRef<number | null>(null);

  const mapBackgroundImage: Record<string, string> = {
    'Board 1': '/board 1.jpeg',
    'Board 2': '/board 2.jpeg',
    'Board 3': '/board 3.avif',
  };
  const backgroundImage = mapBackgroundImage[selectedMap] || '/board 1.jpeg';

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    
    const setCanvasDimensions = () => {
      canvas.width = Math.min(window.innerWidth * 0.8, 800);
      canvas.height = Math.min(window.innerHeight * 0.5, 450);
    };

    setCanvasDimensions();

    const paddleWidth = canvas.width * 0.01;
    const paddleHeight = canvas.height * 0.2;

    const player1 = new Paddle(0, 50, 15, paddleWidth, paddleHeight);
    const player2 = new Paddle(canvas.width - paddleWidth, 30, 15, paddleWidth, paddleHeight);
    const ball = new Ball(canvas.width / 2, canvas.height / 2, 6, 6, 10);

    const keysPressed: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (countdown !== null || winner) return; // Don't allow pausing during countdown or after game over
        setPaused((prev) => !prev);
      }
      keysPressed[e.key] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => (keysPressed[e.key] = false);

    const handleResize = () => {
      setCanvasDimensions();
      player1.height = canvas.height * 0.2;
      player2.height = canvas.height * 0.2;
      ball.respawn(canvas.width, canvas.height, 'left');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);

    const startGame = () => {
      const gameLoop = () => {
        if (winner) return;

        if (!paused) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          drawDashedLine(ctx, canvas);

          player1.update(keysPressed, canvas.height, player1Score);
          player2.updateAI(ball, canvas.height, level);
          ball.update(canvas.width, canvas.height);

          checkCollisions(ball, player1, player2);

          if (ball.pos.x <= -ball.radius) {
            setPlayer2Score((score) => score + 1);
            ball.respawn(canvas.width, canvas.height, 'right');
          }
          if (ball.pos.x >= canvas.width + ball.radius) {
            setPlayer1Score((score) => score + 1);
            ball.respawn(canvas.width, canvas.height, 'left');
          }

          if (player1Score >= parseInt(scoreToWin) || player2Score >= parseInt(scoreToWin)) {
            setWinner(player1Score >= parseInt(scoreToWin) ? 'Player 1' : 'Player 2');
            return;
          }

          player1.draw(ctx);
          player2.draw(ctx);
          ball.draw(ctx);
        }
        animationFrameId.current = requestAnimationFrame(gameLoop);
      };

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    if (countdown !== null) {
      const timer = setInterval(() => {
        setCountdown((prev) => (prev! > 1 ? prev! - 1 : null));
      }, 1000);

      return () => clearInterval(timer);
    } else {
      startGame();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [countdown, player1Score, player2Score, winner, paused, scoreToWin]);

  const handleRestart = () => {
    setPlayer1Score(0);
    setPlayer2Score(0);
    setWinner(null);
    setCountdown(3);
    setPaused(false);
  };

  const leaveButton = () => {
    handleRestart();
    router.push('/game');
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className="relative border-2 rounded-lg shadow-lg p-6 aspect-w-16 aspect-h-9">
        {countdown !== null && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center text-white text-4xl md:text-6xl font-bold">
            {countdown === 0 ? 'Go!' : countdown}
          </div>
        )}
        {paused && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center text-white text-4xl font-bold">
            Paused
          </div>
        )}
        {winner && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center text-white">
            <h1 className="text-2xl md:text-4xl font-bold mb-4">🎉 {winner} Wins! 🎉</h1>
            <button
              onClick={handleRestart}
              className="px-4 py-2 md:px-6 md:py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-700"
            >
              Restart Game
            </button>
          </div>
        )}
        <Scoreboard
          player1Score={player1Score}
          player2Score={player2Score}
          player1Avator={user1.avatar}
          player2Avator={user2.avatar}
          scoreToWin={parseInt(scoreToWin)}
        />
        <div className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl aspect-w-16 aspect-h-9">
          <canvas
            ref={canvasRef}
            className="w-full bg-cover bg-center border-2 border-white rounded-lg"
            style={{
              backgroundImage: `url('${backgroundImage}')`,
              backgroundColor: '#07325F',
            }}
          ></canvas>
        </div>
      </div>
      <div className='absolute bottom-8 right-4'>
        <button
          onClick={leaveButton}
          className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-700"
        >
          Leave
        </button>
      </div>
    </div>
  );
};

// Export the component wrapped in Suspense
export default function AiPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Ai />
    </Suspense>
  );
}