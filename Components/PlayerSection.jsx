import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, colorOpacity } from '../consts';
import HefezKlaf from './HefezKlaf';
import { globalStyles } from '../globalStyles';
import { callApi } from '../mock-server/callApi';
import { useState } from 'react';


export default function PlayerSection({ player, boardState, changeTurn, handleFold }) {

    const [raiseAmount, setRaiseAmount] = useState(null);


    const disabled = (boardState['turnNumber'] !== player['playerNumber']); // disable all if this is not the player's turn
    const raiseDisabled = (raiseAmount === null) || (player['remainingChips'] < raiseAmount) || (raiseAmount < boardState.minBetSize) // disable raise if not enough chips or amount too small
    const raiseInputColor = raiseDisabled ? 'red' : 'green'

    function handleBet(text) {
        setRaiseAmount(text);
    }


    function handleCall() {
        let betAmount = boardState.minBetSize - player.betSize;
        if (betAmount >= player['remainingChips']) {
            betAmount = player['remainingChips']
            console.log('--all in for ', betAmount);
        }
        changeTurn(betAmount);
    }

    function handleRaise() {
        raiseAmountNumber = Number(raiseAmount)
        // Check if player has enough chips

        if (player['remainingChips'] >= raiseAmountNumber) {
            changeTurn(raiseAmountNumber);
            setRaiseAmount(null);
        }
        else {
            console.log('--not enough chips for raise of ', raiseAmount);
        }
    }

    return (
        <View style={[styles.mainContainer, (('playerNumber' in player && 'turnNumber' in boardState) && (boardState.turnNumber === player.playerNumber)) && globalStyles.chosenOutline, disabled && globalStyles.disabled]}>

            <View style={styles.topRow}>
                <View style={{justifyContent: 'center'}}>
                    <Text>🪙: {player['remainingChips']}</Text>
                    <Text>Ⓜ️ : {player['maxWinnable']}</Text>
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
                    <Text style={globalStyles.buttonText}>
                        {boardState['minBetSize'] === 0 ? 'Check' : "Call"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyles.genericButton} onPress={handleFold} disabled={disabled}>
                    <Text style={globalStyles.buttonText}>
                        Fold
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={[globalStyles.genericButton, ((!disabled && raiseDisabled) && globalStyles.disabled)]} onPress={handleRaise} disabled={disabled || raiseDisabled}>
                    <Text style={globalStyles.buttonText}>
                        Raise
                    </Text>
                </TouchableOpacity>

                <TextInput keyboardType='numeric' placeholder={'min: ' + boardState.minBetSize} value={raiseAmount} style={[styles.inputButton, (raiseDisabled && styles.inputButtonDisabled)]} onChangeText={text => handleBet(text)} editable={!disabled}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 20,
        // backgroundColor: COLORS.base500,

        backgroundColor: colorOpacity(COLORS.secondary, 0.3),
        borderWidth: 1,
        borderColor: COLORS.neutral,
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
        height: 50,
    },
    inputButtonDisabled: {
        color: 'red',
    }

});