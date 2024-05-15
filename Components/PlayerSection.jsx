import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { COLORS } from '../consts';
import HefezKlaf from './HefezKlaf';
import { globalStyles } from '../globalStyles';
import { callApi } from '../mock-server/callApi';
import { useState } from 'react';


export default function PlayerSection({ player, boardState, changeTurn }) {

    const [raiseAmount, setRaiseAmount] = useState(0);


    disabled = (boardState['turnNumber'] !== player['playerNumber']);

    function handleBet(e) {
        setRaiseAmount(Number(e.nativeEvent.text));
    }

    function handleCall() {
        const betAmount = boardState.minBetSize - player.betSize;
        changeTurn(betAmount);
    }

    function handleRaise() {
        const betAmount = raiseAmount;
        changeTurn(betAmount);
    }

    return (
        <View style={[styles.mainContainer, (('playerNumber' in player && 'turnNumber' in boardState) && (boardState.turnNumber === player.playerNumber)) && globalStyles.chosenOutline, disabled && globalStyles.disabled]}>

            <View style={styles.topRow}>
                <View style={{justifyContent: 'center'}}>
                    <Text>🪙: {player['remainingChips']}</Text>
                </View>
                
                <View style={[styles.betContainer, (boardState['actionOn'] === player['playerNumber']) && globalStyles.chosenOutline]}>
                    <Text>Bet: {player['betSize']}$</Text>
                </View>
            </View>

            <View style={styles.midRow}>
                <HefezKlaf title={'klafs' in player ? player['klafs'][0] : null} />
                <HefezKlaf title={'klafs' in player ? player['klafs'][1] : null} />
            </View>

            <View style={styles.bottomRow}>
                <TouchableOpacity style={[globalStyles.genericButton]} onPress={handleCall} disabled={disabled}>
                    <Text>
                        {boardState['minBetSize'] === 0 ? 'Check' : "Call"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyles.genericButton} onPress={() => console.log(player)} disabled={disabled}>
                    <Text>
                        Fold
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyles.genericButton} onPress={handleRaise} disabled={disabled}>
                    <Text>
                        Raise
                    </Text>
                </TouchableOpacity>

                <TextInput keyboardType='numeric' placeholder='gogo' style={styles.inputButton} onSubmitEditing={handleBet} editable={!disabled} />
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
        justifyContent: 'space-between',

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