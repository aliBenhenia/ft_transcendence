export class Ball {
  pos: { x: number; y: number };
  velocity: { x: number; y: number };
  radius: number;

  constructor(x: number, y: number, vx: number, vy: number, radius: number) {
    this.pos = { x, y };
    this.velocity = { x: vx, y: vy };
    this.radius = radius;
  }

  update(canvasWidth: number, canvasHeight: number) {
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;

    // Bounce off top and bottom edges
    if (this.pos.y - this.radius <= 0 || this.pos.y + this.radius >= canvasHeight) {
      this.velocity.y *= -1;
    }

    // Cap the speed to prevent excessive difficulty
    const maxSpeed = 12;
    this.velocity.x = Math.min(maxSpeed, Math.max(this.velocity.x, -maxSpeed));
    this.velocity.y = Math.min(maxSpeed, Math.max(this.velocity.y, -maxSpeed));
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  respawn(canvasWidth: number, canvasHeight: number, direction: 'left' | 'right') {
    this.pos = {
      x: direction === 'left' ? 150 : canvasWidth - 150,
      y: Math.random() * (canvasHeight - 200) + 100,
    };
    this.velocity = {
      x: (Math.random() * 2 + 3) * (direction === 'left' ? 1 : -1), // Random speed
      y: (Math.random() * 2 - 1) * 4, // Random angle
    };
  }
}

export class Paddle {
  pos: { x: number; y: number };
  velocity: number;
  width: number;
  height: number;
  private reactionTimer: number; // Timer to handle AI reaction delays

  constructor(x: number, y: number, velocity: number, width: number, height: number) {
    this.pos = { x, y };
    this.velocity = velocity;
    this.width = width;
    this.height = height;
    this.reactionTimer = 0;
  }

  update(keysPressed: Record<string, boolean>, canvasHeight: number, score: number) {
    const adjustedVelocity = this.velocity + score * 0.8; // Increase speed slightly
    if (keysPressed['ArrowUp']) {
      this.pos.y = Math.max(0, this.pos.y - adjustedVelocity);
    }
    if (keysPressed['ArrowDown']) {
      this.pos.y = Math.min(canvasHeight - this.height, this.pos.y + adjustedVelocity);
    }
  }

  // updateAI(ball: Ball, canvasHeight: number, reactionTime: number) {
  //   // Reduce reactionTimer based on elapsed time
  //   if (this.reactionTimer > 0) {
  //     this.reactionTimer -= 1;
  //     return; // Skip update until timer reaches zero
  //   }

  //   // Reset the timer based on reactionTime (lower reactionTime = quicker AI)
  //   this.reactionTimer = Math.max(1, Math.floor(60 / reactionTime));

  //   // Predict ball movement
  //   let targetY = ball.pos.y + (ball.velocity.y * (this.pos.x - ball.pos.x)) / ball.velocity.x;

  //   // Account for wall bounces
  //   while (targetY < 0 || targetY > canvasHeight) {
  //     if (targetY < 0) targetY = -targetY;
  //     else if (targetY > canvasHeight) targetY = 2 * canvasHeight - targetY;
  //   }

  //   const centerY = this.pos.y + this.height / 2;
  //   if (targetY > centerY + this.velocity) {
  //     this.pos.y = Math.min(canvasHeight - this.height, this.pos.y + this.velocity);
  //   } else if (targetY < centerY - this.velocity) {
  //     this.pos.y = Math.max(0, this.pos.y - this.velocity);
  //   }
  // }
  updateAI(ball: Ball, canvasHeight: number,  difficulty: "easy" | "medium" | "hard") {
    // Reduce reactionTimer based on elapsed time
    if (this.reactionTimer > 0) {
      this.reactionTimer -= 1;
      return; // Skip update until timer reaches zero
    }

    // Reset the timer based on reactionTime (lower reactionTime = quicker AI)
    this.reactionTimer = Math.max(1, Math.floor(20 / 8));

    // Adjust AI behavior based on difficulty
    let speedMultiplier = 1.0; // Default speed multiplier
    let reactionChance = 1.0; // Default reaction probability

    switch (difficulty) {
      case "easy":
        speedMultiplier = 0.7; // Slower movement
        reactionChance = 0.4; // 40% chance of reacting
        break;
      case "medium":
        speedMultiplier = 0.7; // Standard speed
        reactionChance = 0.5; // 50% chance of reacting
        break;
      case "hard":
        speedMultiplier = 1.2; // Faster movement
        reactionChance = 1.0; // Always reacts
        break;
    }

    if (Math.random() > reactionChance) return; // Skip reaction based on chance

    // Predict ball movement
    let targetY = ball.pos.y + (ball.velocity.y * (this.pos.x - ball.pos.x)) / ball.velocity.x;

    // Account for wall bounces
    while (targetY < 0 || targetY > canvasHeight) {
      if (targetY < 0) targetY = -targetY;
      else if (targetY > canvasHeight) targetY = 2 * canvasHeight - targetY;
    }

    const centerY = this.pos.y + this.height / 2;
    const adjustedVelocity = this.velocity * speedMultiplier; // Adjust speed based on difficulty

    // Smoothly move towards the target position
    if (targetY > centerY + adjustedVelocity) {
      this.pos.y = Math.min(canvasHeight - this.height, this.pos.y + adjustedVelocity);
    } else if (targetY < centerY - adjustedVelocity) {
      this.pos.y = Math.max(0, this.pos.y - adjustedVelocity);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
  }
}

export function checkCollisions(ball: Ball, paddle1: Paddle, paddle2: Paddle) {
  // Check collision with paddles
  const collidesWithPaddle = (paddle: Paddle) => {
    const dx = Math.abs(ball.pos.x - (paddle.pos.x + paddle.width / 2));
    const dy = Math.abs(ball.pos.y - (paddle.pos.y + paddle.height / 2));
    return (
      dx < ball.radius + paddle.width / 2 &&
      dy < ball.radius + paddle.height / 2
    );
  };

  let hasCollided = false;

  if (!hasCollided && collidesWithPaddle(paddle1)) {
    const offset = (ball.pos.y - (paddle1.pos.y + paddle1.height / 2)) / (paddle1.height / 2);
    ball.velocity.x *= -1;
    ball.velocity.y += offset * 2; // Add spin
    ball.pos.x = paddle1.pos.x + paddle1.width + ball.radius; // Adjust ball position to prevent overlap
    hasCollided = true;
  }

  if (!hasCollided && collidesWithPaddle(paddle2)) {
    const offset = (ball.pos.y - (paddle2.pos.y + paddle2.height / 2)) / (paddle2.height / 2);
    ball.velocity.x *= -1;
    ball.velocity.y += offset * 2; // Add spin
    ball.pos.x = paddle2.pos.x - ball.radius; // Adjust ball position to prevent overlap
    hasCollided = true;
  }
}
