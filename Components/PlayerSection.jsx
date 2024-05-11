import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { COLORS } from '../consts';
import HefezKlaf from './HefezKlaf';
import { globalStyles } from '../globalStyles';
import { callApi } from '../mock-server/callApi';


export default function PlayerSection({player, boardState, changeTurn}) {

    function handleBet(e) {
        console.log(e.nativeEvent.text);
    }

    return (
        <View style={[styles.mainContainer, (('playerNumber' in player && 'turnNumber' in boardState) && (boardState.turnNumber === player.playerNumber)) && globalStyles.chosenOutline]}>

            <View style={styles.topRow}>
                <View style={styles.betContainer}>
                    <Text>Bet: {player['betSize']}$</Text>
                </View>
            </View>

            <View style={styles.midRow}>
                <HefezKlaf title={'klafs' in player ? player['klafs'][0] : null}/>
                <HefezKlaf title={'klafs' in player ? player['klafs'][1] : null}/>
            </View>

            <View style={styles.bottomRow}>
                <TouchableOpacity style={globalStyles.genericButton} onPress={() => changeTurn(50)}>
                    <Text>
                        Call
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyles.genericButton} onPress={() => console.log(player)}>
                    <Text>
                        Fold
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyles.genericButton} onPress={() => {console.log(boardState.turnNumber)}}>
                    <Text>
                        Raise
                    </Text>
                </TouchableOpacity>

                <TextInput keyboardType='numeric' placeholder='bet' style={styles.inputButton} onSubmitEditing={handleBet}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
      width: '100%',
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: COLORS.base500,
    },
    topRow: {
        width: '100%',
        height: '20%',
        flexDirection: 'row',
        justifyContent: 'flex-end',

    },
    midRow: {
        flexDirection: 'row',
        gap: 15,
        height: '50%',
    },
    bottomRow: {
        height: '30%',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 5,
    },
    betContainer: {
        backgroundColor: COLORS.base100,
        padding: 3,
        borderRadius: 10,
        justifyContent: 'center',
        width: '30%'
    },
    inputButton: {
        backgroundColor: COLORS.base100,
        width: 100,
        height: 50
    }

  });