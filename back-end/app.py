from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit
import engine
from random import randint

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, cors_allowed_origins='*')

@app.route('/')
def index():
    return "SocketIO Server"

@socketio.on('message')
def handle_message(msg):
    print(f"Message: {msg}")
    send(msg, broadcast=True)

@socketio.on('custom_event')
def handle_custom_event(data):
    print(f"Custom Event Data: {data}")
    emit('response', {'data': 'Custom event received!'})

@socketio.on('add_chips')
def add_chips(data):
    new_chips = data['chips'] + 10
    print(f"Adding chips to {new_chips}")
    emit('res_add_chips', {'chips': new_chips})

# Game API
@socketio.on('init_game')
def init_game(data):
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

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
