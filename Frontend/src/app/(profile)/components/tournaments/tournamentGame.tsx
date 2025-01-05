'use client';
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Scoreboard from "./Scoreboard";
import { Ball, Paddle, checkCollisions } from "@/utils/1v1";

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

export default function OneVone() {
    const router = useRouter();

    const scoreToWin = parseInt('3');
    

    const canvasRef = useRef<HTMLCanvasElement>(null);

    
    const [matches, setMatches] = useState(() => JSON.parse(localStorage.getItem('matches') || '[]'));
    const [currentMatch, setCurrentMatch] = useState(matches[0] || null);
    const [player1Score, setPlayer1Score] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [winner, setWinner] = useState<string | null>(null);
    const [countdown, setCountdown] = useState<number | null>(3);
    const [paused, setPaused] = useState(false);
    const animationFrameId = useRef<number | null>(null);

    const backgroundImage = '/board1.jpeg';
    useEffect(() => {
        if (!currentMatch) return;
        
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        canvas.width = Math.min(window.innerWidth * 0.8, 800);
        canvas.height = Math.min(window.innerHeight * 0.5, 450);

        const paddleWidth = canvas.width * 0.01;
        const paddleHeight = canvas.height * 0.2;

        const player1 = new Paddle(0, 50, 15, paddleWidth, paddleHeight);
        const player2 = new Paddle(canvas.width - paddleWidth, 30, 15, paddleWidth, paddleHeight);
        const ball = new Ball(canvas.width / 2, canvas.height / 2, 6, 6, 10);

        const keysPressed: Record<string, boolean> = {};

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === ' ') {
                if (countdown !== null || winner) return;
                setPaused((prev) => !prev);
            }
            keysPressed[e.key] = true;
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            keysPressed[e.key] = false;
        };

        const startGame = () => {
            const gameLoop = () => {
                if (!paused) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    drawDashedLine(ctx, canvas);
                    player1.update1(keysPressed, canvas.height, player1Score);
                    player2.update2(keysPressed, canvas.height, player2Score);
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

                    if (player1Score >= scoreToWin || player2Score >= scoreToWin) {
                        setWinner(player1Score >= scoreToWin ? currentMatch.player1.alias : currentMatch.player2.alias);
                    }

                    player1.draw(ctx);
                    player2.draw(ctx);
                    ball.draw(ctx);
                }
                animationFrameId.current = requestAnimationFrame(gameLoop);
            };
            if (!winner){
                animationFrameId.current = requestAnimationFrame(gameLoop);
               }
        };

        if (countdown !== null) {
            const interval = setInterval(() => {
                setCountdown((prev) => (prev! > 1 ? prev! - 1 : null));
            }, 1000);
            return () => clearInterval(interval);
        } else {
            startGame();
        }

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        };
    }, [countdown, winner, paused, player1Score, player2Score]);

    const handleNextMatch = () => {
        const remainingMatches = matches.slice(1);
        setMatches(remainingMatches);
        localStorage.setItem('matches', JSON.stringify(remainingMatches));

        if (remainingMatches.length) {
            setCurrentMatch(remainingMatches[0]);
            setPlayer1Score(0);
            setPlayer2Score(0);
            setWinner(null);
            setCountdown(3);
        } else {
            alert('Tournament Finished!');
            localStorage.removeItem('registeredPlayers');
            localStorage.removeItem('matches');
            router.push('/tournament');
        }
    };
    const leaveButton = () => {
        setPlayer1Score(0);
        setPlayer2Score(0);
        setWinner(null);
        setCountdown(3);
        setPaused(false);
        localStorage.removeItem('registeredPlayers');
        localStorage.removeItem('matches');
        router.push('/tournament');
    }
    return (
        <div className='flex flex-col items-center justify-center'>
            <div
                className="relative border-2 rounded-lg shadow-lg p-6 aspect-w-16 aspect-h-9"
            >
                {/* Countdown Overlay */}
                {countdown !== null && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center text-white text-4xl md:text-6xl font-bold">
                        {countdown === 0 ? 'Go!' : countdown}
                    </div>
                )}

                {/* Game Over Overlay */}
                {paused && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center text-white text-4xl font-bold">
                        Paused
                    </div>
                )}
                {winner && (
                    <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center text-white">
                        <h1 className="text-2xl md:text-4xl font-bold mb-4">🎉 {winner} Wins! 🎉</h1>
                        <button
                            onClick={handleNextMatch}
                            className="px-4 py-2 md:px-6 md:py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-700"
                        >
                            Next Match
                        </button>
                    </div>
                )}

                {/* Scoreboard */}
                <Scoreboard
                   player1={{ alias: currentMatch?.player1?.alias || 'Player 1' , avatar: currentMatch?.player1?.avatar || '/board1.jpeg' }}
                   player2={{ alias: currentMatch?.player2?.alias || 'Player 2', avatar: currentMatch?.player2?.avatar || '/board1.jpeg' }}
                    player1Score={player1Score}
                    player2Score={player2Score}
                />

                {/* Canvas */}
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
            <div className='absolute bottom-8 right-8'>
                <button
                    onClick={leaveButton}
                    className="  px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-700"
                >
                    leave Tournament
                </button>
            </div>
        </div>
    );
}
