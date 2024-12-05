// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import Scoreboard from './Scoreboard';
// import { Ball, Paddle, checkCollisions } from '@/utils/bot';
// import { useRouter } from 'next/navigation';


// const user1 = {
//   avatar: '/me.jpeg',
// };

// const user2 = {
//   avatar: '/bot.jpg',
// };

// function drawDashedLine(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
//   ctx.strokeStyle = "#fff"; // White for playground elements
//   ctx.lineWidth = 2;

//   // Draw the center dashed line
//   const centerX = canvas.width / 2;
//   ctx.setLineDash([10, 15]); // Dashed line
//   ctx.beginPath();
//   ctx.moveTo(centerX, 0);
//   ctx.lineTo(centerX, canvas.height);
//   ctx.stroke();
// }

// const Ai = () => {
//   //get the selected board from url
//   const router = useRouter();
//   const [boardColor, setBoardColor] = useState<string>("");

//   useEffect(() => {
//     // Get the board query parameter from the URL
//     const params = new URLSearchParams(window.location.search);
//     const board = params.get("board");

//     if (board) {
//       setBoardColor(board); // Update the board color
//     } else {
//       // If no board is selected, redirect back to the main selection page
//       router.push("/game");
//     }
//   }, [router]);
//   //end
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [player1Score, setPlayer1Score] = useState(0);
//   const [player2Score, setPlayer2Score] = useState(0);
//   const [winner, setWinner] = useState<string | null>(null); // Track the winner
//   const [countdown, setCountdown] = useState<number | null>(3); // Countdown timer
//   const animationFrameId = useRef<number | null>(null); // Track animation frame ID

//   useEffect(() => {
//     const canvas = canvasRef.current!;
//     const ctx = canvas.getContext('2d')!;
   
//     canvas.width = Math.min(window.innerWidth * 0.8, 800);
//     canvas.height = Math.min(window.innerHeight * 0.4, 450);

//     const paddleWidth = canvas.width * 0.01;
//     const paddleHeight = canvas.height * 0.2;

//     const player1 = new Paddle(0, 50, 15, paddleWidth, paddleHeight);
//     const player2 = new Paddle(canvas.width - paddleWidth, 30, 15, paddleWidth, paddleHeight);
//     const ball = new Ball(canvas.width / 2, canvas.height / 2, 6, 6, 10);

//     const keysPressed: Record<string, boolean> = {};

//     const handleKeyDown = (e: KeyboardEvent) => (keysPressed[e.key] = true);
//     const handleKeyUp = (e: KeyboardEvent) => (keysPressed[e.key] = false);

//     window.addEventListener('keydown', handleKeyDown);
//     window.addEventListener('keyup', handleKeyUp);

//     const startGame = () => {
//       const gameLoop = () => {
//         if (winner) return; // Stop the game loop if there is a winner

//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         drawDashedLine(ctx, canvas);

//         //for bot AI
//         player1.update(keysPressed, canvas.height, player1Score);
//         player2.updateAI(ball,canvas.height);
//         ball.update(canvas.width, canvas.height);

//         // Check collisions
//         checkCollisions(ball, player1, player2);

//         // Handle scoring
//         if (ball.pos.x <= -ball.radius) {
//           setPlayer2Score((score) => score + 1);
//           ball.respawn(canvas.width, canvas.height, 'right');
//         }
//         if (ball.pos.x >= canvas.width + ball.radius) {
//           setPlayer1Score((score) => score + 1);
//           ball.respawn(canvas.width, canvas.height, 'left');
//         }

//         // Check for a winner
//         if (player1Score >= 8 || player2Score >= 8) {
//           setWinner(player1Score >= 8 ? 'Player 1' : 'Player 2');
//           return;
//         }

//         // Draw game elements
//         player1.draw(ctx);
//         player2.draw(ctx);
//         ball.draw(ctx);

//         animationFrameId.current = requestAnimationFrame(gameLoop);
//       };

//       animationFrameId.current = requestAnimationFrame(gameLoop);
//     };

//     // Handle countdown before starting the game
//     if (countdown !== null) {
//       const timer = setInterval(() => {
//         setCountdown((prev) => (prev! > 1 ? prev! - 1 : null));
//       }, 1000);

//       return () => clearInterval(timer);
//     } else {
//       startGame();
//     }

//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       window.removeEventListener('keyup', handleKeyUp);
//       if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
//     };
//   }, [countdown, player1Score, player2Score, winner]);

//   const handleRestart = () => {
//     setPlayer1Score(0);
//     setPlayer2Score(0);
//     setWinner(null);
//     setCountdown(3); // Restart countdown
//   };

//   return (
//     <div className="relative  border rounded-lg shadow-lg p-6 aspect-w-16 aspect-h-9">
//       {/* Countdown Overlay */}
//       {countdown !== null && (
//         <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center text-white text-6xl font-bold">
//           {countdown === 0 ? 'Go!' : countdown}
//         </div>
//       )}

//       {/* Game Over Overlay */}
//       {winner && (
//         <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center text-white">
//           <h1 className="text-4xl font-bold mb-4">🎉{winner} 🎉Wins🎉</h1>
//           <button
//             onClick={handleRestart}
//             className="px-6 py-3 text-sm md:text-base lg:text-lg bg-green-500 text-white font-bold rounded-lg hover:bg-green-900"
//           >
//             Restart Game
//           </button>
//         </div>
//       )}

//       {/* Scoreboard */}
//       <Scoreboard
//         player1Score={player1Score}
//         player2Score={player2Score}
//         player1Avator={user1.avatar}
//         player2Avator={user2.avatar}
//       />

//       {/* Canvas */}
//       <div className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl aspect-w-16 aspect-h-9">
//         <canvas ref={canvasRef} className="w-full h-full bg-[#064e3b]  bg-contain"
//          style={{
//           backgroundImage: "url('/two.png')",
//         }}
//         ></canvas>
//       </div>
//     </div>
//   );
// };

// export default Ai;

'use client';

import { useEffect, useRef, useState } from 'react';
import Scoreboard from './Scoreboard';
import { Ball, Paddle, checkCollisions } from '@/utils/bot';
import { useRouter } from 'next/navigation';

const user1 = {
  avatar: '/me.jpeg',
};

const user2 = {
  avatar: '/bot.jpg',
};

function drawDashedLine(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#fff"; // White for playground elements
  ctx.lineWidth = 2;

  // Draw the center dashed line
  const centerX = canvas.width / 2;
  ctx.setLineDash([10, 15]); // Dashed line
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height);
  ctx.stroke();
}

const Ai = () => {
  // Get the selected board from the URL
  const router = useRouter();
  const [boardColor, setBoardColor] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const board = params.get("board");

    if (board) {
      setBoardColor(board); // Update the board color
    } else {
      // Redirect to game selection if no board is chosen
      router.push("/game");
    }
  }, [router]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(3);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
   
    canvas.width = Math.min(window.innerWidth * 0.8, 800);
    canvas.height = Math.min(window.innerHeight * 0.4, 450);

    const paddleWidth = canvas.width * 0.01;
    const paddleHeight = canvas.height * 0.2;

    const player1 = new Paddle(0, 50, 15, paddleWidth, paddleHeight);
    const player2 = new Paddle(canvas.width - paddleWidth, 30, 15, paddleWidth, paddleHeight);
    const ball = new Ball(canvas.width / 2, canvas.height / 2, 6, 6, 10);

    const keysPressed: Record<string, boolean> = {};

    const handleKeyDown = (e: KeyboardEvent) => (keysPressed[e.key] = true);
    const handleKeyUp = (e: KeyboardEvent) => (keysPressed[e.key] = false);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const startGame = () => {
      const gameLoop = () => {
        if (winner) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawDashedLine(ctx, canvas);

        // Update AI and Player movements
        player1.update(keysPressed, canvas.height, player1Score);
        player2.updateAI(ball, canvas.height);
        ball.update(canvas.width, canvas.height);

        // Check collisions
        checkCollisions(ball, player1, player2);

        // Handle scoring
        if (ball.pos.x <= -ball.radius) {
          setPlayer2Score((score) => score + 1);
          ball.respawn(canvas.width, canvas.height, 'right');
        }
        if (ball.pos.x >= canvas.width + ball.radius) {
          setPlayer1Score((score) => score + 1);
          ball.respawn(canvas.width, canvas.height, 'left');
        }

        // Check for winner
        if (player1Score >= 8 || player2Score >= 8) {
          setWinner(player1Score >= 8 ? 'Player 1' : 'Player 2');
          return;
        }

        // Draw game elements
        player1.draw(ctx);
        player2.draw(ctx);
        ball.draw(ctx);

        animationFrameId.current = requestAnimationFrame(gameLoop);
      };

      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    // Handle countdown before starting the game
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
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [countdown, player1Score, player2Score, winner]);

  const handleRestart = () => {
    setPlayer1Score(0);
    setPlayer2Score(0);
    setWinner(null);
    setCountdown(3);
  };

  return (
    <div
      className="relative border rounded-lg shadow-lg p-6 aspect-w-16 aspect-h-9"
      // style={{
      //   backgroundColor: boardColor, // Apply the selected board color
      // }}
    >
      {/* Countdown Overlay */}
      {countdown !== null && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center text-white text-6xl font-bold">
          {countdown === 0 ? 'Go!' : countdown}
        </div>
      )}

      {/* Game Over Overlay */}
      {winner && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-bold mb-4">🎉 {winner} Wins! 🎉</h1>
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-700"
          >
            Restart Game
          </button>
        </div>
      )}

      {/* Scoreboard */}
      <Scoreboard
        player1Score={player1Score}
        player2Score={player2Score}
        player1Avator={user1.avatar}
        player2Avator={user2.avatar}
      />

      {/* Canvas */}
      <div className="w-full sm:max-w-2xl md:max-w-3xl lg:max-w-5xl aspect-w-16 aspect-h-9">
        <canvas
          ref={canvasRef}
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('/two.png')`, // Use image based on board color
            backgroundColor: boardColor
          }}
        ></canvas>
      </div>
    </div>
  );
};

export default Ai;
