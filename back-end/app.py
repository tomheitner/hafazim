from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room, rooms
import engine
from random import randint

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, cors_allowed_origins='*')

@app.route('/')
def index():
    return "SocketIO Server"

@socketio.on('connect')
def handle_connect():
    print('--user connected with sid: ', request.sid)


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
    # if my_room['board']['turnNumber'] >= engine.NUM_PLAYERS - 1:
    if my_room['board']['turnNumber'] >= len(my_room['players']) - 1:
        my_room['board']['turnNumber'] = 0
    
    else:
        my_room['board']['turnNumber'] += 1

    # Handle raise
    if my_room['players'][player_number]['betSize'] > my_room['board']['minBetSize']:
        my_room['board']['actionOn'] = player_number # change the actionOn to the player that raised
        my_room['board']['minBetSize'] = my_room['players'][player_number]['betSize'] # update minBetSize to the new bet amount
    
    if (my_room['board']['turnNumber'] == my_room['board']['actionOn']):  # if round changed
        next_round(my_room) 

    emit('update_room', my_room, to=data['roomId'])
        
    

@socketio.on('create_room')
def create_room(data):
    # input schema: roomId: str

    print('--init game--')
    new_room = engine.create_new_room(room_id=data['roomId'])

    # Add player to room
    new_player = engine.create_new_player(0, request.sid)
    new_room['players'].append(new_player)
    join_room(data['roomId'])  # Adds the current sid holder to the room


    engine.rooms[new_room['roomId']] = new_room
    print('--created new room: ', new_room)

    emit('update_room', new_room, to=new_room['roomId'])


@socketio.on('add_player_to_room')
def add_player_to_room(data):
    # Data schema: {roomId}
    print(f'Adding player {request.sid} to room {data["roomId"]}') # TODO: Remove to protect from injections
    my_room = engine.rooms[data['roomId']]

    # First check if the player is already in the room
    for player in my_room['players']:
        if player['sid'] == request.sid:
            print('--found player in room already - doing nothing (rejoin)--')
            return


    join_room(data['roomId']) # joins the sid to the room

    # Create the new player and add to room
    new_player = engine.create_new_player(len(my_room['players']), request.sid)
    my_room['players'].append(new_player)

    emit('update_room', my_room, to=data['roomId'])
    print('--added--')


@socketio.on('get_room')
def get_room(data):
    # Data schema: {roomId, sendAll}; sendAll - bool, whether to emit the data to the entire room or just the requester sid
    send_to = data['roomId'] if data['sendAll'] == True else request.sid
    print('--sending room data to room ', send_to)
    
    room_data = engine.rooms[data['roomId']]
    emit('update_room', room_data, to=send_to)

@socketio.on('get_player_number')
def get_player_number(data):
    # Data schema: {roomId}; output schema: {playerNumber}
    # Returns the player number matching sid of the requester
    room_players = engine.rooms[data['roomId']]['players']
    output = {}
    for player in room_players:
        if player['sid'] == request.sid:
            output['playerNumber'] = player['playerNumber']
    
    emit('my_player_number', output)

@socketio.on('list_rooms')
def show_rooms():
    print('--showing rooms: ', rooms())
    print('rooms size: ', len(engine.rooms))
    print('--all rooms: ', engine.rooms)


@socketio.on('submit_drawing')
def submit_drawing(data):
    # Data schema: {roomId, playerNumber, drawingData}
    my_room = engine.rooms[data['roomId']]
    my_room['players'][data['playerNumber']]['drawing'] = data['drawingData'] # Update drawing for the selected player

    emit('update_room',my_room , to=data['roomId']) # Send update to all players


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
