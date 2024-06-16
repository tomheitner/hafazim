import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { COLORS, colorOpacity } from '../consts';
import HefezKlaf from './HefezKlaf';
import { globalStyles } from '../globalStyles';
import { getRandomInt } from '../mock-server/restApi';
import { useContext } from 'react';
import { GameContext } from '../gameContext';


export default function TableSection({ navigation, changeTurn, finishGame, setModalOpen }) {

    const {boardState, players, ataPlayerNumber, roomId} = useContext(GameContext)

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

                {boardState['roundNumber'] === 4 ?
                    <>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', gap: 10 }}>
                            <TouchableOpacity onPress={() => setModalOpen(true)}><Text>🥇</Text></TouchableOpacity>
                        </View>
                    </>
                    :
                    <>
                        <TouchableOpacity style={globalStyles.genericButton} onPress={() => { navigation.navigate('Drawing', { roomId: roomId, ataPlayerNumber: ataPlayerNumber }) }}>
                            <Text style={globalStyles.buttonText}>🎨</Text>
                        </TouchableOpacity>



                        <View style={{ justifyContent: 'center' }}>
                            <Text>Bet Size: {boardState['minBetSize']} $</Text>
                            <Text>Action On: Player {boardState['actionOn']}</Text>
                            <Text>Round: {boardState['roundNumber']}</Text>
                        </View>
                    </>
                }


                <View style={styles.potContainer}>
                    {'pots' in boardState ?
                        <Text>Pot: {boardState['pots'][boardState['pots'].length - 1]['size']}$</Text>
                        : null}
                </View>
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
    }

});