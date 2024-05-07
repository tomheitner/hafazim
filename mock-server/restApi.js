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
    'nextTurn': nextTurn,
}

// functions

function initGame() {
    const output = {
        potSize: 0,
        turnNumber: 0, // whos turn it is
        tableKlafs: [null, null, null, null, null],
        ataPlayer: {
            playerNumber: 0,
            remainingChips: 500,
            betSize: 90,
            klafs: [allKlafs[Math.floor(Math.random()*10)], allKlafs[Math.floor(Math.random()*10)]]
        },
        otherPlayers: { // key is the player number for each player
            1: {
                playerNumber: 1,
                remainingChips: 500,
                betSize: 70
            },
            2: {
                playerNumber: 2,
                remainingChips: 500,
                betSize: 80
            }
        }
    }

    return JSON.stringify(output)
}

function nextTurn(input) {
    data = JSON.parse(input);

    if (data['turnNumber'] > 1) return 0;
    else return (data['turnNumber'] + 1);
} 
 