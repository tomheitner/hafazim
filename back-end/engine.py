from random import randint

# CONSTS
MIN_STAKE = 5
STRATING_CHIPS = 50
NUM_PLAYERS = 3

ALL_KLAFS = [
    'מצית',
    'מאפרה',
    'כוס',
    'מחברת',
    'מטרייה',
    'כיסא',
    'שולחן',
    'כובע',
    'מעיל',
    'אטריה'
]


# All game rooms
rooms = {

}

room_schema = {
    'roomId': str,
    'board': dict, # Board 
    'players': list # [Player]
}

board_schema =  {
            'potSize': int,
            'actionOn': int, # which player has the action, when a player raises the action moves to him and only if it goes to the actionOn turn number without a raise you move to the next round
            'turnNumber': int, # whos turn it is
            'roundNumber': int, # the round of the game (0: init, 1: flop, 2: turn, 3: river, 4: finish)
            'tableKlafs': list, # [klaf]
            'minBetSize': int,
        },

player_schema = {
    'id': str,

}

def create_new_room():
    new_room = room_schema.copy()
    new_room['roomId'] = len(rooms) + 1

    # Create new board
    new_board = create_new_board()

    # Create 3 new players
    new_players = []
    for i in range(3):
        new_player = create_new_player(player_number=i)
        new_players.append(new_player)
    
    new_room['board'] = new_board
    new_room['players'] = new_players

    print('--new room: ', new_room)

    return new_room




def create_new_board():
    new_board =  {
            'potSize': 0,
            'actionOn': 0, # which player has the action, when a player raises the action moves to him and only if it goes to the actionOn turn number without a raise you move to the next round
            'turnNumber': 0, # whos turn it is
            'roundNumber': 0, # the round of the game (0: init, 1: flop, 2: turn, 3: river, 4: finish)
            'tableKlafs': [None, None, None, None, None], # [klaf]
            'minBetSize': MIN_STAKE,
        }
    return new_board



def create_new_player(player_number):
    new_player = {
                'playerNumber': player_number,
                'remainingChips': STRATING_CHIPS,
                'betSize': 0,
                'klafs': [ALL_KLAFS[randint(0, 9)], ALL_KLAFS[randint(0, 9)]]
    }
    return new_player

def generate_klaf():
    new_klaf = ALL_KLAFS[randint(0, 9)]
    return new_klaf