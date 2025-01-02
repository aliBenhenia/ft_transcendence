

The WebSocket connection is made to the URL: "ws://ip:port/ws/pingpong/?token=token_here"
,This is where players will connect to join the game.

Waiting for Players: 
If you're added to queue, you'll see a message indicating that you're searching for a player that match your level or close to it
{
    'type': 'searching',
    'message': '
}

if 30 seconds passed without finding a player on your level, the searching range is expanded
{
    'type' : 'Searching expanded'
}

when no opponent it is found
{
    'type' : 'No_opponent'
}

when you are already in a queue
{
    'type' : 'Already in queue'
}

when you are already in a game
{
    'type' : 'Already in game'
}

Game Start:
When the second player joins then both players are ready, the server will send a message 'game_start', to show informations
about the the players, when game_start is sent it waits for 5 seconds before sending the 'game_state' message.
{
    'type': 'game start',
    'player1_username' : 'some_username',
    'player1_username' : 'some_username',
    'player1_avatar' : 'avatar_url',
    'player2_avatar' : 'avatar_url'
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
