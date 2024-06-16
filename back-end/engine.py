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

def create_new_room(room_id):
    new_room = {}
    new_room['roomId'] = room_id
    new_room['remainingKlafs'] = ALL_KLAFS.copy()

    # Create new board
    new_board = create_new_board()

    # Create 3 new players
    new_players = []
    
    new_room['board'] = new_board
    new_room['players'] = new_players

    print('--[engine] new room: ', new_room)

    return new_room




def create_new_board():
    new_board =  {
            'pots': [{'size': 0, 'players': []}],
            'actionOn': 0, # which player has the action, when a player raises the action moves to him and only if it goes to the actionOn turn number without a raise you move to the next round
            'turnNumber': 0, # whos turn it is
            'roundNumber': 0, # the round of the game (0: init, 1: flop, 2: turn, 3: river, 4: finish)
            'tableKlafs': [None, None, None, None, None], # [klaf]
            'minBetSize': MIN_STAKE,
            'winnerVotes': {} # playernumber: votesAmount; if player has folded winnerVotes for that player number will be None
        }
    return new_board



def create_new_player(player_number, sid):
    new_player = {
                'sid': sid,
                'playerNumber': player_number,
                # 'remainingChips': STRATING_CHIPS,
                'remainingChips': randint(10, 100),
                'betSize': 0,
                'klafs': [],  # When creating new player, generate two klafs and redefine player.klafs
                'drawing': {'data': '', 'title': '', 'description': ''}, # schema: {data: str, title: str, description: str}
                'selectedKlafs': [None, None],
                'isActive': True, # Whether this get a turn next time (for example folded players); inactive players can still vote
    }
    return new_player

def generate_klaf(my_room):
    if (len(my_room['remainingKlafs']) < 1):
        print('--restocking klafs--')
        my_room['remainingKlafs'] = ALL_KLAFS.copy()

    klaf_index = randint(0, len(my_room['remainingKlafs']) - 1)
    new_klaf = my_room['remainingKlafs'].pop(klaf_index)
    print('--generated klaf: ', new_klaf)
    return new_klaf