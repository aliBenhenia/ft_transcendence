

The WebSocket connection is made to the URL: "ws://ip:port/ws/pingpong/?token=token_here"
,This is where players will connect to join the game.

Waiting for Players: 
If you're the first player to join, you'll see a message indicating that you're waiting for the second player to join.
{
    'type': 'waiting',
    'message': 'Waiting for another player to join...'
}

Game Start:
When the second player joins then both players are ready, the server will send a message to start the game.
{
    'type': 'game start',
    'message': 'Player Ready'
}

Game State:
The game state is updated, Every time the game state changes, the server will send the updated state to the client.
{
    'type': 'game_state',
    'game_state': {
        'player1Y': 150,
        'player2Y': 150,
        'ballX': 400,
        'ballY': 200,
        'score': [1, 0]
    }
}
player1Y, player2Y: The vertical position of each player's paddle
ballX, ballY: The current position of the ball.

Sending Player Moves:
The frontend will listen for key events (ArrowUp, ArrowDown) to move the player's paddle. When a player moves their paddle, the frontend will send a message to the server:
{
    'action': 'move',
    'direction': 'ArrowUp'
}

Game End:
If a player disconnects or the game ends, the server will send a message indicating the game is over or that the opponent has disconnected.
{
    'type': 'game ends',
    'message': 'You win! Opponent disconnected'
}
OR
{
    'type': 'game ends',
    'message': 'You win!',
    'final_score: [5, 0]
}

If a player is already in a queue or in game.
{
    'type' : 'Already in queue'
}
OR
{
    'type' : 'Already in game'
}
