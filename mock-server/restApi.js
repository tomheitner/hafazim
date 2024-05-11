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

export const restApi = {
    'initGame': initGame,
    'nextTurn': handleNextRound,
}

// functions

function initGame() {
    const output = {
        boardState: {
            potSize: 0,
            turnNumber: 0, // whos turn it is
            roundNumber: 0, // the round of the game (0: init, 1: flop, 2: turn, 3: river, 4: finish)
            tableKlafs: [null, null, null, null, null],
            minBetSize: 5
        },
        
        players: { // key is the player number for each player
            0: { // ataPlayer
                playerNumber: 0,
                remainingChips: 500,
                betSize: 50,
                klafs: [allKlafs[Math.floor(Math.random() * 10)], allKlafs[Math.floor(Math.random() * 10)]]
            },
            1: {
                playerNumber: 1,
                remainingChips: 500,
                betSize: 0
            },
            2: {
                playerNumber: 2,
                remainingChips: 500,
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
    if (data['betAmount'] > data['boardState']['minBetSize']) data['boardState']['minBetSize'] = data['betAmount']; // update min bet size

    //calc new turn number
    if (data['boardState']['turnNumber'] > 1) {
        data['boardState']['turnNumber'] = 0;
        data['boardState']['minBetSize'] = 0;
    } 
    else data['boardState']['turnNumber'] = data['boardState']['turnNumber'] + 1;

    // calc round number
    let roundNumber = data['boardState']['roundNumber']
    let tableKlafs = data.boardState.tableKlafs
    if (data.boardState.turnNumber == 0) { // if turn changed
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
    }
    

    // update player state
    data['player']['remainingChips'] = data['player']['remainingChips'] - data['betAmount'];
    data['player']['betSize'] = data['betAmount'];


    const output = JSON.stringify(data);
    return output;

}
