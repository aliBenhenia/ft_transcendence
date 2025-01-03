import json
from notification.socket import extract_auth_user, get_recipient
from channels.generic.websocket import AsyncWebsocketConsumer
import random
import string
import asyncio
from .models import Game
from chat.models import GameInvite
from datetime import datetime
import time
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from urllib.parse import parse_qs

math = __import__('math')
green = "\033[92m"
CANVAS_WIDTH = 800
CANVAS_HEIGHT = 400
PADDLE_WIDTH = 10
PADDLE_HEIGHT = 100
PADDLE_SPEED = 10
BALL_SPEED = 5
BALL_RADIUS = 10
INITIAL_BALL_SPEED = 4
BALL_SPEED_INCREMENT = 0.1
MAX_BALL_SPEED = 13
WINNING_SCORE = 5

class LiveGameFlow(AsyncWebsocketConsumer):
    games = {}
    game_queue = []
    in_game = []
    game_queues = {}
    LEVEL_RANGE_INCREMENT = 1
    MAX_WAIT_TIME = 30
    invites = {}

    @staticmethod
    def generate_room_id():
        return ''.join(random.choices(string.ascii_lowercase + string.digits, k=9))

    async def add_to_waiting_queue(self):
        player_level = await sync_to_async(lambda: self.scope['user'].DETAILS.level)()
        timestamp = time.time()
        player_data = {
            'player': self,
            'level': player_level,
            'timestamp': timestamp
        }
        if player_level not in self.game_queues:
            self.game_queues[player_level] = []
        self.game_queues[player_level].append(player_data)
        print(self.game_queues.keys())
        print(f"Player {self.scope['user'].username} (Level {player_level}) added to waiting queue.")
        await self.send(text_data=json.dumps({
            'type': 'searching',
            'message': 'Looking for a match...'
        }))
        await self.find_match()

    async def find_match(self):
        player_level = await sync_to_async(lambda: self.scope['user'].DETAILS.level)()
        current_time = time.time()
        level_range = 0
        
        while level_range <= max(player_level, len(self.game_queues)):
            # Check levels above and below the player's level
            if all(entry['player'] != self for queue in self.game_queues.values() for entry in queue):
                return
            for level_diff in range(-level_range, level_range + 1):
                check_level = player_level + level_diff
                if check_level in self.game_queues:
                    # Filter out the current player and get viable opponents
                    viable_opponents = [
                        p for p in self.game_queues[check_level]
                        if p['player'] != self
                    ]
                    # Sort opponents by wait time (longest wait first)
                    viable_opponents.sort(
                        key=lambda x: current_time - x['timestamp'],
                        reverse=True
                    )
                    for opponent_data in viable_opponents:
                        print("Opponent found")
                        opponent = opponent_data['player']
                        if any(entry['player'] == self for entry in self.game_queues.get(player_level, [])):
                            # Remove both players from their queues
                            self.game_queues[player_level] = [
                                p for p in self.game_queues[player_level]
                                if p['player'] != self
                            ]
                            self.game_queues[check_level] = [
                                p for p in self.game_queues[check_level]
                                if p['player'] != opponent
                            ]
                            # Clean up empty queues
                            for level in list(self.game_queues.keys()):
                                if not self.game_queues[level]:
                                    del self.game_queues[level]
                            # Start the game
                            await self.start_game_with_opponent(opponent, None)
                            return
            wait_time = time.time() - current_time
            if wait_time >= self.MAX_WAIT_TIME:
                await self.send(text_data=json.dumps({
                    'type' : 'Searching expanded'
                }))
                level_range += self.LEVEL_RANGE_INCREMENT
                current_time = time.time()
            await asyncio.sleep(1)
        await self.send(text_data=json.dumps({
            'type' : 'No_opponent'
        }))

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

    async def start_game_with_opponent(self, opponent, room_name):
            if room_name == None:
                room_name = self.generate_room_id()
            self.games[room_name] = {
                'players' : [self, opponent],
                'game_state' : self.initialize_game_state()
            }
            for number, player in enumerate([self, opponent], start=1):
                player.room_name = room_name
                player.player_number = number
                await player.send(text_data=json.dumps(
                {
                    'type': 'game_start',
                    'player_number' : player.player_number,
                    'room_name' : room_name,
                    'player1_level' : await sync_to_async(lambda: self.scope['user'].DETAILS.level)(),
                    'player2_level' : await sync_to_async(lambda: opponent.scope['user'].DETAILS.level)(),
                    'player1_username' : self.scope['user'].username,
                    'player2_username' : opponent.scope['user'].username,
                    'player1_avatar' : getattr(self.scope['user'], 'photo_url', None),
                    'player2_avatar' : getattr(opponent.scope['user'], 'photo_url', None)
                }))
            self.in_game.append(self.scope['user'].username)
            self.in_game.append(opponent.scope['user'].username)
            await asyncio.sleep(1)
            print("before game task")
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
                if is_left_paddle:
                    print('hits the paddle 1')
                else:
                    print('hits the paddle 2')
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

    def calculate_xp_to_add(self, player, oponnent_player, result):
        if result == "win":
            if player.level == oponnent_player.level:
                return 25
            if player.level < oponnent_player.level:
                return 50
            if player.level > oponnent_player.level:
                return 10
        else:
            if player.level == oponnent_player.level:
                return 25
            if player.level < oponnent_player.level:
                return 10
            if player.level > oponnent_player.level:
                return 50

    @database_sync_to_async
    def update_players_stats(self, winner_player, loser_player):
        player_states = winner_player.DETAILS
        player_states.win += 1
        player_states.total_match += 1
        player_states.last_match = "win"
        player_states.xp_total += self.calculate_xp_to_add(winner_player.DETAILS, loser_player.DETAILS, "win")
        player_states.save()
        #
        player_states = loser_player.DETAILS
        player_states.loss += 1
        player_states.total_match += 1
        player_states.last_match = "loss"
        if player_states.xp_total > 0:
            player_states.xp_total -= self.calculate_xp_to_add(winner_player.DETAILS, loser_player.DETAILS, "loss")
        player_states.save()

    async def end_game(self, room_name, winner):
        if room_name in self.games:
            game = self.games[room_name]
            winner_player = None
            loser_player = None
            winner_score = 0
            loser_score = 0
            for player in game['players']:
                try:
                    # Winner
                    if player.player_number == winner:
                        winner_player = player.user
                        winner_score = game['game_state']['score'][player.player_number - 1]
                        await player.send(text_data=json.dumps({
                            'type': 'game_ends',
                            'message': 'You win!',
                            'final_score': game['game_state']['score']
                        }))
                        print(f"sending result of the game for player winner : {player.user.username}")
                        
                    # Loser
                    else:
                        loser_player = player.user
                        loser_score = game['game_state']['score'][player.player_number - 1]
                        await player.send(text_data=json.dumps({
                            'type': 'game_ends',
                            'message': 'You lost!',
                            'final_score': game['game_state']['score']
                        }))
                        print(f"sending result of the game for player loser : {player.user.username}")
                        
                except:
                    pass
            await self.update_players_stats(winner_player, loser_player)
            game['players'].clear()
            self.in_game.clear()
            #save in database
            await sync_to_async(Game.objects.create)(
                end_time=datetime.now(),
                winner=winner_player,
                loser=loser_player,
                winner_score=winner_score,
                loser_score=loser_score
            )
            del self.games[room_name]

    async def game_task(self, room_name):
        while room_name in self.games:
            game = self.games[room_name]
            if len(game['players']) < 2:
                self.games.pop(room_name)
            self.update_game_state(game['game_state'])
            # sending game states
            for player in game['players']:
                await player.send(text_data=json.dumps({
                        'type': 'game_state',
                        'game_state': game['game_state']
                    }))
            # Check for a winner
            if game['game_state']['score'][0] >= WINNING_SCORE:
                await self.end_game(room_name, winner=1)
            elif game['game_state']['score'][1] >= WINNING_SCORE:
                await self.end_game(room_name, winner=2)
            await asyncio.sleep(1 / 60)

    async def check_for_second_player(self, room_name, timeout):
        try:
            await asyncio.sleep(timeout)
            if room_name in self.invites and len(self.invites[room_name]) < 2:
                player = self.invites[room_name][0]
                await player.send(text_data=json.dumps({"error": "Timeout: No second player joined."}))
                await sync_to_async(lambda: GameInvite.objects.filter(room_name=room_name).delete())()
                del self.invites[room_name]
        except Exception as e:
            print(f"Error during timeout check: {e}")

    async def connect(self):
        query_params = parse_qs(self.scope['query_string'].decode())
        room_name = query_params.get('room_name', [None])[0]
        if room_name != None:
            print("from invite")
            self.user = self.scope['user']
            await self.accept()
            if room_name in self.games:
                if room_name not in self.invites:
                    self.invites[room_name] = []
                self.invites[room_name].append(self)
                if (len(self.invites[room_name])) == 2:
                    await self.start_game_with_opponent(self.invites[room_name][0], room_name)
                    del self.invites[room_name]
                elif (len(self.invites[room_name])) == 1:
                    await self.send(text_data=json.dumps(
                    {
                        "type": "waiting",
                        "message": "Waiting for player to join..."
                    }))
                    asyncio.create_task(self.check_for_second_player(room_name, timeout=15))
            else:
                await self.send(text_data=json.dumps({"error": "Invalid room or game not found."}))
                await self.close()
        ##
        else:
            user = self.scope['user']
            if user:
                self.user = user
                # if player is already in a queue
                user_level = await sync_to_async(lambda: self.user.DETAILS.level)()
                if user_level in self.game_queues:
                    queue = self.game_queues[user_level]
                    for p in queue:
                        if p['player'].scope['user'] == self.user:
                            await self.send(text_data=json.dumps(
                            {
                                'type' : 'Already in queue'
                            }))
                            self.close()
                            return
                # if player is in game
                if user.username in self.in_game:
                    await self.send(text_data=json.dumps(
                    {
                        'type' : 'Already in game'
                    }))
                    self.close()
                    return
                await self.accept()
                await self.add_to_waiting_queue()
            else:
                await self.close()

    async def disconnect(self, close_code):
        print(f"Player {self.scope['user'].username} disconnected")
        # Remove player from queue if present
        player_level = await sync_to_async(lambda: self.scope['user'].DETAILS.level)()
        if player_level in self.game_queues:
            self.game_queues[player_level] = [
                p for p in self.game_queues[player_level]
                if p['player'] != self
            ]
            if not self.game_queues[player_level]:
                del self.game_queues[player_level]
        if hasattr(self, 'room_name') and self.room_name in self.games:
                game = self.games[self.room_name]
                game['players'].remove(self)
                await self.send(text_data=json.dumps(
                {
                    'type' : 'game_ends',
                    'message' : 'You disconnected'
                }))
                if game['players']:
                    remaining_player = game['players'][0]
                    print(f"remaining one : {remaining_player.user.username}")
                    await remaining_player.send(text_data=json.dumps(
                    {
                        'type' : 'game_ends',
                        'message' : 'You win! Opponent disconnected'
                    }))
                    game['players'].remove(remaining_player)
                    del self.games[self.room_name]
                    self.in_game.clear()
                    print(f"games after : {len(self.games)}")

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
