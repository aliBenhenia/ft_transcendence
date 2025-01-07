export interface GameState {
    player1Y: number;
    player2Y: number;
    ballX: number;
    ballY: number;
    score: [number, number];
  }
  
  export type Direction = "ArrowUp" | "ArrowDown";
  
  export interface Message {
    type: string;
    game_state?: GameState;
    message?: string;
  }
  