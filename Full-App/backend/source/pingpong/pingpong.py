from .tools import on_save_match
import time
import asyncio
from django.utils import timezone
yellow = "\033[93m"
green = "\033[92m"
red = "\033[91m"

# function to initialize game elements
def initialize_game():
    """Initializes the game with ball, paddles, and scoreboard."""
    # Initialize the ball
    ball = { 'event': 'ball', 'x': 50, 'y': 50, 'radius': 0.6, 'vx': -0.3, 'vy': 0.2 }
    
    # Initialize the left paddle
    playerLeft = { 'x': 1.3, 'y': 38, 'width': 0.7, 'height': 24 }
    
    # Initialize the right paddle
    playerRight = { 'x': 98, 'y': 38, 'width': 0.7, 'height': 24 }
    
    # Initialize the scoreboard
    scoreboard = { 'left': 0, 'right': 0 }
    
    # Start the game
    start = False

    start_time = time.time()

    time_start = timezone.now()
    
    is_end = False

    return ball, playerLeft, playerRight, scoreboard, start, start_time, time_start, is_end

# function to reset the ball
def reset_ball(ball, direction):
    """Resets the ball to the center with a new direction after a score."""
    ball['x'] = 50
    ball['y'] = 50
    ball['vx'] = abs(ball['vx']) * direction  # Positive or negative based on who scored

    return ball

def handle_paddle_collision(ball, paddle, num):
        """Handle ball collision with a paddle."""
        # Reverse X velocity on paddle hit
        ball['vx'] *= -1

        # Reverse Y velocity if hitting the edges of the paddle
        if ball['y'] < paddle['y'] + ball['radius'] or ball['y'] > paddle['y'] + paddle['height'] - ball['radius']:
            ball['vy'] *= -1

        # Move the ball completely outside the paddle to prevent overlap
        if num == 1:
            ball['x'] = paddle['x'] + paddle['width'] + ball['radius']
        elif num == 2:
            ball['x'] = paddle['x'] - ball['radius']
        
        # Add a small buffer to ensure the ball doesn't collide immediately again
        if ball['vx'] < 0:
            ball['x'] -= ball['vx']  # Move further left if moving left
        else:
            ball['x'] += ball['vx']  # Move further right if moving right

        return ball

def check_side_collision(ball, playerLeft, playerRight):
    if ball['y'] < ball['radius'] or ball['y'] > 100 - ball['radius']:
        ball['vy'] *= -1
        ball['y'] = max(min(ball['y'], 100 - ball['radius']), ball['radius'])

    # Left paddle collision
    if (ball['x'] < playerLeft['x'] + playerLeft['width'] + ball['radius'] and ball['y'] > playerLeft['y'] and
        ball['x'] > playerLeft['x'] + ball['radius'] and  ball['y'] < playerLeft['y'] + playerLeft['height']):
        ball = handle_paddle_collision(ball, playerLeft, 1)

    # Right paddle collision
    if (ball['x'] > playerRight['x'] - ball['radius'] and ball['y'] < playerRight['y'] + playerRight['height'] 
        and ball['x'] < playerRight['x'] and ball['y'] > playerRight['y']):
        ball = handle_paddle_collision(ball, playerRight, 2)

    return ball

async def check_score(scoreboard, user, reciver, LiveGameFlow, time_start):
    # Save match results when a player reaches 8 points
    if scoreboard['left'] == 8 or scoreboard['right'] == 8:
        if scoreboard['left'] == 8:
            await on_save_match(user, reciver, scoreboard['left'], scoreboard['right'], LiveGameFlow, time_start)
        elif scoreboard['right'] == 8:
            await on_save_match(reciver, user, scoreboard['right'], scoreboard['left'], LiveGameFlow, time_start)

async def cleanup_game(u0, user, reciver, LiveGameFlow):
    """Cleans up the game state and removes players."""
    
    # Check if `u0` is valid
    if u0:
        # Remove the user from the `LiveGameFlow.players` dict if present
        if user.username in LiveGameFlow.players:
            del LiveGameFlow.players[user.username]
        
        # Remove the receiver from the `LiveGameFlow.players` dict if present
        if reciver.username in LiveGameFlow.players:
            del LiveGameFlow.players[reciver.username]
        
        # Reset the global players dictionary if that's the intent
        LiveGameFlow.players = {}
        LiveGameFlow.goals = {"goals": []}

async def update_paddle_position(playerLeft, playerRight, message):
    """Updates the paddles' positions based on the received message."""
    try:
        if message['side'] == 'left':
            playerLeft.update(message)
        elif message['side'] == 'right':
            playerRight.update(message)
    except (KeyError, TypeError):
        print(f'[ERROR] Invalid position data: {message}')

async def upadte_data(data, LiveGameFlow, user, reciver, time_start, data_track):
    left_score = LiveGameFlow.players[user.username]['left_score']
    right_score = LiveGameFlow.players[user.username]['right_score']
    if data['command'] == 'quit':
        print (f"[ ==> ] {yellow}", data)
        # Cleanup when the game ends                
        if data['sender'] == user.username:
            await on_save_match(reciver, user, right_score, left_score, LiveGameFlow, time_start)
        elif data['sender'] == reciver.username:
            await on_save_match(reciver, user, left_score, right_score, LiveGameFlow, time_start)
        data_track = {'quit': True}
        LiveGameFlow.players[user.username] = data_track

    data_track = {
        'sender': user.username,
        'message': data['message'] if data['command'] == 'position' else '',
        'left_score': left_score,
        'right_score': right_score,
        'quit': True if data['command'] == 'quit' else False
    }
    LiveGameFlow.players[user.username] = data_track
    LiveGameFlow.players[reciver.username] = data_track
    return data_track


async def handle_ball_collisions(LiveGameFlow, ball, user, reciver, scoreboard, playerLeft, playerRight, start_time, send_score_update):
        """Handles ball collisions with walls and paddles."""
        # Check if ball hits the left or right side of the paddles
        ball = check_side_collision(ball, playerLeft, playerRight)

        # Check if ball crosses the left boundary (Right player scores)
        if ball['x'] < ball['radius']:
            scoreboard['right'] += 1
            
            # Create a goal entry for the right player
            goal_entry = { "user": reciver.username, "score": scoreboard['right'], "time": time.time() - start_time }
            
            # Append the goal entry to the goals list
            if "goals" not in LiveGameFlow.goals:
                LiveGameFlow.goals["goals"] = []  # Initialize the goals list if it doesn't exist

            LiveGameFlow.goals["goals"].append(goal_entry)  # Add the new goal entry
            
            LiveGameFlow.players[user.username]['right_score'] = scoreboard['right']
            LiveGameFlow.players[reciver.username]['right_score'] = scoreboard['right']

            await send_score_update(scoreboard)
            
            ball = reset_ball(ball, direction=1)  # Right player serves next
            print (f"[ ==> ] {yellow} {reciver.username} scores!")
        # Check if ball crosses the right boundary (Left player scores)
        elif ball['x'] > 100 - ball['radius']:
            scoreboard['left'] += 1
            
            # Create a goal entry for the left player
            goal_entry = { "user": user.username, "score": scoreboard['left'], "time": time.time() - start_time }
            
            # Append the goal entry to the goals list
            if "goals" not in LiveGameFlow.goals:
                LiveGameFlow.goals["goals"] = []  # Initialize the goals list if it doesn't exist

            LiveGameFlow.goals["goals"].append(goal_entry)  # Add the new goal entry
            
            LiveGameFlow.players[user.username]['left_score'] = scoreboard['left']
            LiveGameFlow.players[reciver.username]['left_score'] = scoreboard['left']
            
            await send_score_update(scoreboard)
            ball = reset_ball(ball, direction=-1)  # Left player serves next
            print (f"[ ==> ] {yellow} {user.username} scores!")

async def check_end_game(ball, start, LiveGameFlow, user, reciver, scoreboard, data_track, playerLeft, playerRight):
    # Handle quitting conditions early
    user1 = LiveGameFlow.players[user.username]
    user2 = LiveGameFlow.players[reciver.username]
    left_score = scoreboard['left']
    right_score = scoreboard['right']
    # Check if any player quit or a player reached the winning score
    if (user1 and user1.get('quit')) or (user2 and user2.get('quit')) or (left_score == 8 or right_score == 8):
        start = False
        return ball, start, True  # Return the ball and True (game ended)

    # Update ball position
    ball['x'] += ball['vx']
    ball['y'] += ball['vy']
    # Get the latest position data from the other player
    if user2 and data_track: 
        receiver_data = user2
        receiver_message = receiver_data.get('message')
        data_track_message = data_track.get('message')

    # Update paddles based on incoming messages
    if receiver_message:
        await update_paddle_position(playerLeft, playerRight, receiver_message)

    if data_track_message:
        await update_paddle_position(playerLeft, playerRight, data_track_message)

    return ball, start, False  # Return the ball and False (game continues)

async def update_ball(self, ball, user, reciver, scoreboard, playerLeft, playerRight, start_time, send_score_update, u0, start, is_end, LiveGameFlow, data_track, time_start, Session, is_me):
    """Handles ball movement and game updates."""
    try:
        if not f"{self.is_me}" in LiveGameFlow.Data:
            await asyncio.sleep(2)
            await Session({ 'command': 'start', 'message': "start" })
            await asyncio.sleep(0.3)
        start = True
        while start:
            # Check if the game is over
            # print(f"Left Paddle: {playerLeft}")
            if f"{is_me}" in LiveGameFlow.Data:
                save_variable = LiveGameFlow.Data[is_me]
                if save_variable :
                    ball = save_variable['ball'] 
                    playerLeft = save_variable['playerLeft'] 
                    playerRight = save_variable['playerRight'] 
                    scoreboard = save_variable['scoreboard']
                    start = save_variable['start'] 
                    time_start = save_variable['time_start']
                    is_end = save_variable['is_end']

            ball, start, is_end = await check_end_game(ball, start, LiveGameFlow, user, reciver, 
            scoreboard, data_track, playerLeft, playerRight)
            if is_end == True and start == False:
                break
            # Handle ball collisions with paddles and walls
            await handle_ball_collisions(self, ball, user, reciver, scoreboard, playerLeft, playerRight, start_time, send_score_update)

            # Send updated ball position to the group
            await Session({ 'command': 'ball', 'message': ball })

            save_data = {
                'ball': ball,
                'playerLeft': playerLeft,
                'playerRight': playerRight,
                'scoreboard': scoreboard,
                'start': start,
                'time_start': time_start,
                'is_end': is_end
            }
            LiveGameFlow.Data[is_me] = save_data
            await asyncio.sleep(1 / 60)  # 60 updates per second
    finally:
        if is_end == True and start == False:
            # Save match results when a player reaches 8 points
            await check_score(scoreboard, user, reciver, LiveGameFlow, time_start)
            # Cleanup when the game ends
            await cleanup_game(u0, user, reciver, LiveGameFlow)