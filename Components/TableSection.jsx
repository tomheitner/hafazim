import { StyleSheet, Text, View, TouchableOpacity, Button, Alert } from 'react-native';
import { COLORS, colorOpacity } from '../consts';
import HefezKlaf from './HefezKlaf';
import { globalStyles } from '../globalStyles';
import { getRandomInt } from '../mock-server/restApi';
import { useContext, useState, useEffect } from 'react';
import { GameContext } from '../gameContext';


export default function TableSection({ navigation, changeTurn, setModalOpen }) {

    const { boardState, players, ataPlayerNumber, roomId } = useContext(GameContext)
    const [readyToVotePlayers, setReadyToVotePlayers] = useState(0); // count of players that have finished all changed to their drawing and are ready to vote on a winner
    const [votesSum, setVotesSum] = useState(0); // count of number of votes for a winner

    useEffect(() => {
        if (players.length > 0) {
            // Calculate how many players have finished making last changes to their drawing and are ready to vote for a winner
            const readyPlayersList = players.filter(player => player['readyToVote'] === true);
            setReadyToVotePlayers(readyPlayersList.length);

            // Calc how many players have voted for a winner already
            const allVotesSum = Object.values(boardState['winnerVotes']).reduce((a, b) => a + b, 0); // calclate the sum of all votes for all drawings
            setVotesSum(allVotesSum);

            if (allVotesSum < 1) {
                // check if all players are ready to vote and jump to gallery
                if (readyPlayersList.length === players.length) {
                    setModalOpen(true);
                }
            }

        }
    }, [players])

    function handleNextTurn() {
        if (boardState.turnNumber === 0) {
            changeTurn(50);
        }
        else {
            const randChoose = getRandomInt(0, 10);
            if (randChoose > 7) { // raise
                const callAmount = players[boardState.turnNumber].betSize - boardState.minBetSize;
                const betAmount = getRandomInt(callAmount + 1, callAmount + 100);
                changeTurn(betAmount);
            }
            else { //call
                const betAmount = boardState.minBetSize - players[boardState.turnNumber].betSize;
                changeTurn(betAmount);
            }
        }
    }


    console.log(votesSum);
    return (
        <View style={[styles.mainContainer]} on>

            <View style={styles.midRow}>
                <HefezKlaf moreCardStyles={styles.klaf} title={('tableKlafs' in boardState) ? boardState['tableKlafs'][0] : null} />
                <HefezKlaf moreCardStyles={styles.klaf} title={('tableKlafs' in boardState) ? boardState['tableKlafs'][1] : null} />
                <HefezKlaf moreCardStyles={styles.klaf} title={('tableKlafs' in boardState) ? boardState['tableKlafs'][2] : null} />
                <HefezKlaf moreCardStyles={styles.klaf} title={('tableKlafs' in boardState) ? boardState['tableKlafs'][3] : null} />
                <HefezKlaf moreCardStyles={styles.klaf} title={('tableKlafs' in boardState) ? boardState['tableKlafs'][4] : null} />
            </View>

            <View style={styles.bottomRow}>
                {ataPlayerNumber !== null && votesSum > 0 ?
                    <>
                        <Text>Waiting For Players to finish voting ({votesSum} / {players.length})</Text>
                    </>
                    :
                    ataPlayerNumber !== null && players[ataPlayerNumber]['readyToVote'] === true ?
                        <>
                            <Text>Waiting For Players to finish drawing ({readyToVotePlayers} / {players.length})</Text>
                        </>
                        :

                        <>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <TouchableOpacity style={globalStyles.genericButton} onPress={() => { navigation.navigate('Drawing', { roomId: roomId, ataPlayerNumber: ataPlayerNumber }) }}>
                                    <Text style={globalStyles.buttonText}>🎨</Text>
                                </TouchableOpacity>

                                {boardState['roundNumber'] === 4 &&
                                    <Text style={styles.finalChanges} >{"   <-- Final changes"}</Text>
                                }


                            </View>

                            <View style={styles.potContainer}>
                                {'pots' in boardState ?
                                    <Text>Pot: {boardState['pots'][boardState['pots'].length - 1]['size']}$</Text>
                                    : null}
                            </View>
                        </>
                }
            </View>


        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: '75%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: colorOpacity(COLORS.secondary, 0.3),
        borderWidth: 1,
        borderColor: COLORS.neutral,
        justifyContent: 'space-between',
    },
    bottomRow: {
        width: '100%',
        height: '20%',
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    midRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        height: '50%',
    },
    potContainer: {
        backgroundColor: COLORS.base100,
        padding: 3,
        borderRadius: 10,
        justifyContent: 'center',
        width: '30%'
    },
    klaf: {
        height: '90%',
        width: '17%'
    },
    finalChanges: {
        fontSize: 15,
        color: COLORS.accent,
        fontWeight: '700',
        verticalAlign: 'bottom',
    }

});