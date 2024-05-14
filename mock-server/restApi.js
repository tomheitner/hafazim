const allKlafs = [
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

const minStake = 5;
const startingChips = 500;

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const restApi = {
    'initGame': initGame,
    'nextTurn': handleNextRound,
    'finishGame': handleFinishGame
}

// functions

function initGame() {
    const output = {
        boardState: {
            potSize: 0,
            actionOn: 0, // which player has the action, when a player raises the action moves to him and only if it goes to the actionOn turn number without a raise you move to the next round
            turnNumber: 0, // whos turn it is
            roundNumber: 0, // the round of the game (0: init, 1: flop, 2: turn, 3: river, 4: finish)
            tableKlafs: [null, null, null, null, null],
            minBetSize: minStake,
        },

        players: { // key is the player number for each player
            0: { // ataPlayer
                playerNumber: 0,
                remainingChips: startingChips,
                betSize: 0,
                klafs: [allKlafs[Math.floor(Math.random() * 10)], allKlafs[Math.floor(Math.random() * 10)]]
            },
            1: {
                playerNumber: 1,
                remainingChips: startingChips,
                betSize: 0
            },
            2: {
                playerNumber: 2,
                remainingChips: startingChips,
                betSize: 0
            }
        }
    }

    return JSON.stringify(output)
}

function handleNextRound(input) {
    // input scheme: {boardState, player, betAmount}

    const data = JSON.parse(input);

    data['boardState']['potSize'] = data['boardState']['potSize'] + data['betAmount'];  // update pot size

    //calc new turn number (which player)
    if (data['boardState']['turnNumber'] > 1) {
        data['boardState']['turnNumber'] = 0;
    }
    else data['boardState']['turnNumber'] = data['boardState']['turnNumber'] + 1;

    // handle raise
    if (data.betAmount > data.boardState.minBetSize) {
        data.boardState.actionOn = data.player.playerNumber; // change the actionOn to the player that raised
        data.boardState.minBetSize = data.betAmount; // update minBetSize to the new bet amount
    }

    // calc round number
    let roundNumber = data['boardState']['roundNumber']
    let tableKlafs = data.boardState.tableKlafs
    if (data.boardState.turnNumber == data.boardState.actionOn) { // if turn changed
        data.boardState.minBetSize = 0;
        // handle card opening
        if (roundNumber === 0) {
            data['boardState']['roundNumber'] = 1;
            data['boardState']['tableKlafs'] = [allKlafs[Math.floor(Math.random() * 10)], allKlafs[Math.floor(Math.random() * 10)], allKlafs[Math.floor(Math.random() * 10)], null, null];
        }
        else if (roundNumber === 1) {
            data['boardState']['roundNumber'] = 2;
            tableKlafs[3] = allKlafs[Math.floor(Math.random() * 10)];
            data.boardState.tableKlafs = tableKlafs;
        }
        else if (roundNumber === 2) {
            data['boardState']['roundNumber'] = 3;
            tableKlafs[4] = allKlafs[Math.floor(Math.random() * 10)];
            data.boardState.tableKlafs = tableKlafs;
        }
        else if (roundNumber === 3) {
            data['boardState']['roundNumber'] = 4;
        }
    }


    // update player state
    data['player']['remainingChips'] = data['player']['remainingChips'] - data['betAmount'];
    data['player']['betSize'] = data['betAmount'] + data.player.betSize;


    const output = JSON.stringify(data);
    return output;

}

function handleFinishGame(input) {
    // input scheme: boardState, players, winner: number
    const data = JSON.parse(input);

    // update player states
    for (i in data.players) {
        const newPlayer = { ...data.players[i] }
        newPlayer.klafs = [null, null];
        newPlayer.betSize = 0;

        if (data.players[i].playerNumber === data.winner) { // Winning player
            newPlayer.remainingChips += data.boardState.potSize;
        }

        if (data.players[i].playerNumber === 0) { //ataPlayer
            newPlayer.klafs = [allKlafs[Math.floor(Math.random() * 10)], allKlafs[Math.floor(Math.random() * 10)]];
        }

        data.players[i] = newPlayer
    }

    // update board state
    const newBoardState = {
        potSize: 0,
        actionOn: 0, // which player has the action, when a player raises the action moves to him and only if it goes to the actionOn turn number without a raise you move to the next round
        turnNumber: 0, // whos turn it is
        roundNumber: 0, // the round of the game (0: init, 1: flop, 2: turn, 3: river, 4: finish)
        tableKlafs: [null, null, null, null, null],
        minBetSize: minStake,
    }

    const output = {
        boardState: newBoardState,
        players: data.players
    }

    return JSON.stringify(output);

}
