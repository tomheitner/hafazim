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

def add_all_bets_to_pot(my_room):
    # Gather bets from every player and add it to pot
    for player_number in range(len(my_room['players'])):
        my_room['board']['potSize'] += my_room['players'][player_number]['betSize']  # Update pot size
        my_room['players'][player_number]['betSize'] = 0

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
    add_all_bets_to_pot(my_room)
    

# Game API
@socketio.on('next_turn')
def next_turn(data):
    # input scheme: {room_id: int, betAmout: int, preceedingFold: bool}

    print('--next turn on input: ', data)

    # Get relevant room and current last player's playerNumber
    my_room = engine.rooms[data['roomId']]
    player_number = my_room['board']['turnNumber']

    # update player state
    my_room['players'][player_number]['remainingChips'] -= data['betAmount']
    my_room['players'][player_number]['betSize'] += data['betAmount'] 

    
    # Calc new turn number (which player plays next)
    new_turn_number = player_number + 1 # Set to current turn number + 1
    while True:
        # If you just passed the last player go back to player 0
        if new_turn_number == len(my_room['players']):
            print('--switching to turn number 0')
            new_turn_number = 0
            
        if my_room['players'][new_turn_number]['isActive']:
            print('--found active player in number ', new_turn_number)
            break
        else:
            print(f'--inactive player in number {new_turn_number}')
            new_turn_number += 1
    
    # Fold case
    if 'preceedingFold' in data and data['preceedingFold']:
        # If the player that just folded had the actionOn, move the actionOn to the preceeding player
        if my_room['board']['actionOn'] == player_number:
            my_room['board']['actionOn'] = new_turn_number


    my_room['board']['turnNumber'] = new_turn_number # Update turn number


    # Handle raise
    if my_room['players'][player_number]['betSize'] > my_room['board']['minBetSize']:
        my_room['board']['actionOn'] = player_number # change the actionOn to the player that raised
        my_room['board']['minBetSize'] = my_room['players'][player_number]['betSize'] # update minBetSize to the new bet amount
    
    if (my_room['board']['turnNumber'] == my_room['board']['actionOn']):  # if round changed
        next_round(my_room) 

    print('--sending update_room to everybody--')
    emit('update_room', my_room, to=data['roomId'])
        
    

@socketio.on('create_room')
def create_room(data):
    # input schema: roomId: str

    print('--init game--')
    new_room = engine.create_new_room(room_id=data['roomId'])

    # Add player to room
    new_player = engine.create_new_player(0, request.sid)
    new_room['players'].append(new_player)
    new_room['board']['winnerVotes'][0] = 0
    join_room(data['roomId'])  # Adds the current sid holder to the room


    engine.rooms[new_room['roomId']] = new_room
    print('--created new room: ', new_room)

    # emit('update_room', new_room, to=new_room['roomId'])


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



    # Create the new player and add to room
    ata_player_number = len(my_room['players'])
    new_player = engine.create_new_player(ata_player_number, request.sid)
    my_room['players'].append(new_player)
    my_room['board']['winnerVotes'][ata_player_number] = 0

    # my_room['ata_player_number'] = ata_player_number

    emit('update_room', my_room, to=data['roomId'])

    join_room(data['roomId']) # joins the sid to the room
    print('--added--')


@socketio.on('get_room')
def get_room(data):
    print('--get_room with data: ', data)
    # Data schema: {roomId} 
    
    my_room = engine.rooms[data['roomId']]
    output = my_room.copy()


    # Send player number
    for player in my_room['players']:
        if player['sid'] == request.sid:
            output['ataPlayerNumber'] = player['playerNumber']
    
    print('--sending update_room to ', request.sid)
    emit('update_room', output, to=request.sid)

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

@socketio.on('recieve_vote')
def recieve_vote(data):
    # data_schema: {roomId, playerNumber (the player number of the voted for player)}
    print('--recieved vote with data ', data)
    my_room = engine.rooms[data['roomId']]

    my_room['board']['winnerVotes'][data['playerNumber']] += 1

    # Check if everyone voted
    winner_votes_without_null = [vote for vote in my_room['board']['winnerVotes'].values() if vote is not None]  # Remove null values from list to enable math funcions
    votes_count = sum(winner_votes_without_null)
    if votes_count >= len(my_room['board']['winnerVotes']):

        # Calculate who won
        winner_player_numbers = []
        votes_to_win = max(winner_votes_without_null) # Calculate the amount of votes needed for one or more players to win the game

        winner_player_numbers = [player['playerNumber'] for player in my_room['players'] if my_room['board']['winnerVotes'][player['playerNumber']] == votes_to_win] # Find the player numbers for players who got the needed amount of votes

        finish_game({'roomId': data['roomId'], 'winningPlayers': winner_player_numbers})


def finish_game(data):
    # data schema: {roomId: str, winningPlayers: []}

    print('--finishing the game with data: ', data)

    my_room = engine.rooms[data['roomId']]

    # Split the pot between the winners
    add_all_bets_to_pot(my_room) # Add all remaining bets on the table to the pot
    pot_per_player = my_room['board']['potSize'] // len(data['winningPlayers']) # Add the relevant amount to each player

    # Give each player the pot he deserves
    for i in range(len(my_room['players'])):
        if my_room['players'][i]['playerNumber'] in data['winningPlayers']:
            my_room['players'][i]['remainingChips'] += pot_per_player
    
    # Reset the board
    new_board = engine.create_new_board()
    new_winner_votes = {key: 0 for key in my_room['board']['winnerVotes'].keys()} # Reset winner votes to 0 for every player
    new_board['winnerVotes'] = new_winner_votes

    my_room['board'] = new_board

    # Reset players state as needed
    for i in range(len(my_room['players'])):
        new_player = engine.create_new_player('BULBUL',69)
        new_player['sid'] = my_room['players'][i]['sid']
        new_player['playerNumber'] = my_room['players'][i]['playerNumber']
        new_player['remainingChips'] = my_room['players'][i]['remainingChips']

        my_room['players'][i] = new_player

    emit('update_room', my_room, to=data['roomId'])

@socketio.on('fold')
def fold(data):
    # Data schema: {roomId, playerNumber}
    print('folding player with input ', data)

    my_room = engine.rooms[data['roomId']]
    my_player = my_room['players'][data['playerNumber']]    

    # Change player state
    my_player['isActive'] = False
    my_room['board']['winnerVotes'][data['playerNumber']] = None

    # Add the player's bet to the pot
    my_room['board']['potSize'] += my_player['betSize']
    my_player['betSize'] = 0 

    # Check if the game ends
    active_players = [player['playerNumber'] for player in my_room['players'] if player['isActive']]
    print('--active players found: ', active_players)
    if len(active_players) == 1:
        print('--only one player active - finishing game--')
        finish_game({'roomId': data['roomId'], 'winningPlayers': active_players})
    else: # Game doesn't ene, move to next turn
        next_turn({'roomId': data['roomId'], 'betAmount': 0, 'preceedingFold': True})
    


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
