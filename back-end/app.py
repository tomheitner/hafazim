from flask import Flask, request
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import engine
from random import randint

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, cors_allowed_origins='*')

@app.route('/')
def index():
    return "SocketIO Server"

@socketio.on('connect')
def handle_connect(data):
    print('--user connected--')
    print('data: ', data)

@socketio.on('message')
def handle_message(msg):
    print(f"Message: {msg}")
    send(msg, broadcast=True)


# Server API
def next_round(my_room):
    # Calc round number & Open Klafs

    my_room['board']['minBetSize'] = 0
    # handle card opening
    if (my_room['board']['roundNumber'] == 0):
        my_room['board']['roundNumber'] = 1
        my_room['board']['tableKlafs'] = [engine.generate_klaf(), engine.generate_klaf(), engine.generate_klaf(), None, None]
    
    elif my_room['board']['roundNumber'] == 1: 
        my_room['board']['roundNumber'] = 2
        my_room['board']['tableKlafs'][3] = engine.generate_klaf()
    
    elif my_room['board']['roundNumber'] == 2:
        my_room['board']['roundNumber'] = 3
        my_room['board']['tableKlafs'][4] = engine.generate_klaf()
    
    elif my_room['board']['roundNumber'] == 3: 
        my_room['board']['roundNumber'] = 4

    # gather bets from eveyone and add to POT
    for player_number in range(len(my_room['players'])):
        my_room['board']['potSize'] += my_room['players'][player_number]['betSize']  # Update pot size
        my_room['players'][player_number]['betSize'] = 0
    

# Game API
@socketio.on('init_game_old')
def init_game_old(data):
    print('--init game--')
    output = {
        'boardState': {
            'potSize': 0,
            'actionOn': 0, # which player has the action, when a player raises the action moves to him and only if it goes to the actionOn turn number without a raise you move to the next round
            'turnNumber': 0, # whos turn it is
            'roundNumber': 0, # the round of the game (0: init, 1: flop, 2: turn, 3: river, 4: finish)
            'tableKlafs': [None, None, None, None, None],
            'minBetSize': engine.MIN_STAKE,
        },

        'players': { # key is the player number for each player
            0: { # ataPlayer
                'playerNumber': 0,
                'remainingChips': engine.STRATING_CHIPS,
                'betSize': 0,
                'klafs': [engine.ALL_KLAFS[randint(0, 9)], engine.ALL_KLAFS[randint(0, 9)]]
            },
            1: {
                'playerNumber': 1,
                'remainingChips': engine.STRATING_CHIPS,
                'betSize': 0
            },
            2: {
                'playerNumber': 2,
                'remainingChips': engine.STRATING_CHIPS,
                'betSize': 0
            }
        }
    }
    emit('init_game', output)


@socketio.on('init_game')
def init_game(data):
    print('--init game--')
    new_room = engine.create_new_room()
    engine.rooms[new_room['roomId']] = new_room

    emit('update_room', new_room)


@socketio.on('next_turn')
def next_turn(data):
    # input scheme: {room_id: int, betAmout: int}

    print('--next turn on input: ', data)
    my_room = engine.rooms[data['roomId']]
    player_number = my_room['board']['turnNumber']

    # update player state
    my_room['players'][player_number]['remainingChips'] -= data['betAmount']
    my_room['players'][player_number]['betSize'] += data['betAmount'] 

    
    # Calc new turn number (which player)
    if my_room['board']['turnNumber'] >= engine.NUM_PLAYERS - 1:
        my_room['board']['turnNumber'] = 0
    
    else:
        my_room['board']['turnNumber'] += 1

    # Handle raise
    if my_room['players'][player_number]['betSize'] > my_room['board']['minBetSize']:
        my_room['board']['actionOn'] = player_number # change the actionOn to the player that raised
        my_room['board']['minBetSize'] = my_room['players'][player_number]['betSize'] # update minBetSize to the new bet amount
    
    if (my_room['board']['turnNumber'] == my_room['board']['actionOn']):  # if round changed
        next_round(my_room) 

    socketio.emit('update_room', my_room)
        
    

@socketio.on('show_rooms')
def show_rooms(data):
    print('rooms size: ', len(engine.rooms))
    print('--all rooms: ', engine.rooms)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
