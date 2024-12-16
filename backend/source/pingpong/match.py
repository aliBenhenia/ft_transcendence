import json
from notification.socket import extract_auth_user, get_recipient
from channels.generic.websocket import AsyncWebsocketConsumer
import random
import string
import asyncio
math = __import__('math')
green = "\033[92m"
CANVAS_WIDTH = 800
CANVAS_HEIGHT = 400
PADDLE_WIDTH = 10
PADDLE_HEIGHT = 100
PADDLE_SPEED = 5
BALL_SPEED = 5
BALL_RADIUS = 10
INITIAL_BALL_SPEED = 4
BALL_SPEED_INCREMENT = 0.1
MAX_BALL_SPEED = 13

class LiveGameFlow(AsyncWebsocketConsumer):
    games = {}
    game_queue = []

    @staticmethod
    def generate_room_id():
        return ''.join(random.choices(string.ascii_lowercase + string.digits, k=9))

    async def add_to_waiting_queue(self):
        LiveGameFlow.game_queue.append(self)
        print(f"Player added to waiting queue. Queue size: {len(self.game_queue)}")
        if len(self.game_queue) == 1:
            await self.send(text_data=json.dumps(
            {
                'type': 'waiting',
                'message': 'Waiting for another player to join...'
            }))
        await self.match_players()

    def initialize_game_state(self):
        return {
            'player1Y': CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
            'player2Y': CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
            'ballX': CANVAS_WIDTH / 2,
            'ballY': CANVAS_HEIGHT / 2,
            'ballSpeedX': INITIAL_BALL_SPEED * random.choice([-1, 1]),
            'ballSpeedY': INITIAL_BALL_SPEED * random.choice([-0.5, 0.5]),
            'score': [0, 0],
        }

    async def match_players(self):
        if len(self.game_queue) == 2:
            player1 = self.game_queue.pop(0)
            player2 = self.game_queue.pop(0)
            room_name = self.generate_room_id()
            self.games[room_name] = {
                'players' : [player1, player2],
                'game_state' : self.initialize_game_state()
            }
            for number, player in enumerate([player1, player2], start=1):
                player.room_name = room_name
                player.player_number = number
                await player.send(text_data=json.dumps(
                {
                    'type': 'game start',
                    'message': 'Player Ready'
                }))
            asyncio.create_task(self.game_task(room_name))

    def update_game_state(self, state):
        # Move the ball
        next_ballX = state['ballX'] + state['ballSpeedX']
        next_ballY = state['ballY'] + state['ballSpeedY']

        # Ball collision with top and bottom walls
        if next_ballY - BALL_RADIUS < 0:
            next_ballY = BALL_RADIUS
            state['ballSpeedY'] = abs(state['ballSpeedY'])
        elif next_ballY + BALL_RADIUS > CANVAS_HEIGHT:
            next_ballY = CANVAS_HEIGHT - BALL_RADIUS
            state['ballSpeedY'] = -abs(state['ballSpeedY'])

        # Determine which paddle to check for collision
        is_left_paddle = state['ballSpeedX'] < 0
        paddle_x = PADDLE_WIDTH if is_left_paddle else CANVAS_WIDTH - PADDLE_WIDTH - PADDLE_WIDTH
        paddle_y = state['player1Y'] if is_left_paddle else state['player2Y']

        # Check for collision with paddle
        if (paddle_x - BALL_RADIUS <= next_ballX <= paddle_x + PADDLE_WIDTH + BALL_RADIUS):
            if paddle_y - BALL_RADIUS <= next_ballY <= paddle_y + PADDLE_HEIGHT + BALL_RADIUS:
                # Collision detected
                collision_y = next_ballY - paddle_y
                
                # Calculate collision point
                collide_point = (collision_y - PADDLE_HEIGHT / 2) / (PADDLE_HEIGHT / 2)
                angle = collide_point * (math.pi / 4)  # Max angle of 45 degrees
                direction = 1 if is_left_paddle else -1
                
                speed = math.sqrt(state['ballSpeedX']**2 + state['ballSpeedY']**2)
                state['ballSpeedX'] = direction * abs(speed * math.cos(angle))
                state['ballSpeedY'] = speed * math.sin(angle)

                # Move ball out of paddle to prevent sticking
                if is_left_paddle:
                    next_ballX = paddle_x + PADDLE_WIDTH + BALL_RADIUS
                else:
                    next_ballX = paddle_x - BALL_RADIUS

                # Increase ball speed
                self.increase_ball_speed(state)

        # Update ball position
        state['ballX'] = next_ballX
        state['ballY'] = next_ballY

        # Check if ball is out of bounds (scoring)
        if state['ballX'] - BALL_RADIUS < 0:
            # Player 2 scores
            state['score'][1] += 1
            self.reset_ball(state)
        elif state['ballX'] + BALL_RADIUS > CANVAS_WIDTH:
            # Player 1 scores
            state['score'][0] += 1
            self.reset_ball(state)

    def increase_ball_speed(self, state):
        current_speed = math.sqrt(state['ballSpeedX']**2 + state['ballSpeedY']**2)
        if current_speed < MAX_BALL_SPEED:
            speed_increase = min(BALL_SPEED_INCREMENT, MAX_BALL_SPEED - current_speed)
            speed_multiplier = 1 + (speed_increase / current_speed)
            state['ballSpeedX'] *= speed_multiplier
            state['ballSpeedY'] *= speed_multiplier

    def reset_ball(self, state):
        state['ballX'] = CANVAS_WIDTH / 2
        state['ballY'] = CANVAS_HEIGHT / 2
        speed = BALL_SPEED
        # Set the ball to move horizontally
        state['ballSpeedX'] = speed * random.choice([-1, 1])
        state['ballSpeedY'] = 0  # No vertical speed
        state['particles'] = []

    async def game_task(self, room_name):
        while room_name in self.games:
            game = self.games[room_name]
            self.update_game_state(game['game_state'])
            for player in game['players']:
                await player.send(text_data=json.dumps({
                        'type': 'game_state',
                        'game_state': game['game_state']
                    }))
            await asyncio.sleep(1 / 60)

    async def connect(self):
        user = self.scope['user']
        print("New connection established")
        if user:
            self.user = user
            print(f"Authenticated user: {user.username}")
            await self.accept()
            await self.add_to_waiting_queue()
        else:
            self.close()

    async def disconnect(self, close_code):
        if self in LiveGameFlow.game_queue:
            LiveGameFlow.game_queue.remove(self)
            print(f"Player removed from waiting queue. Queue size: {len(self.game_queue)}")
        if hasattr(self, 'room_name') and self.room_name in self.games:
            game = self.games[self.room_name]
            game['players'].remove(self)
            if game['players']:
                remaining_player = game['players'][0]
                try:
                    await remaining_player.send(text_data=json.dumps(
                    {
                        'type' : 'game ends',
                        'message' : 'You win! Opponent disconnected'
                    }))
                except:
                    pass
                del LiveGameFlow.games[self.room_name]

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            if data['action'] == 'move':
                if hasattr(self, 'room_name') and self.room_name in self.games:
                    game = self.games[self.room_name]
                    player_key = f'player{self.player_number}Y'
                    if data['direction'] == 'ArrowUp':
                        game['game_state'][player_key] = max(0, game['game_state'][player_key] - PADDLE_SPEED)
                    elif data['direction'] == 'ArrowDown':
                        game['game_state'][player_key] = min(CANVAS_HEIGHT - PADDLE_HEIGHT, game['game_state'][player_key] + PADDLE_SPEED)
        except Exception as e:
            print(str(e))
