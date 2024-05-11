import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { COLORS } from '../consts';
import HefezKlaf from './HefezKlaf';
import { globalStyles } from '../globalStyles';


export default function TableSection({boardState, changeTurn}) {

    function handleNextTurn() {
        if (boardState.turnNumber === 0) {
            changeTurn(50);
        }
        else {
            changeTurn(Math.floor(Math.random() * 10));
        }
    }
    return (
        <View style={[styles.mainContainer]} on>  

            <View style={styles.midRow}>
                <HefezKlaf moreCardStyles={styles.klaf} title={('tableKlafs' in boardState) ? boardState['tableKlafs'][0] : null}/>
                <HefezKlaf moreCardStyles={styles.klaf} title={('tableKlafs' in boardState) ? boardState['tableKlafs'][1] : null}/>
                <HefezKlaf moreCardStyles={styles.klaf} title={('tableKlafs' in boardState) ? boardState['tableKlafs'][2] : null}/>
                <HefezKlaf moreCardStyles={styles.klaf} title={('tableKlafs' in boardState) ? boardState['tableKlafs'][3] : null}/>
                <HefezKlaf moreCardStyles={styles.klaf} title={('tableKlafs' in boardState) ? boardState['tableKlafs'][4] : null}/>
            </View>

            <View style={styles.bottomRow}>
                <TouchableOpacity style={globalStyles.genericButton} onPress={handleNextTurn}>
                    <Text>▶️</Text>
                </TouchableOpacity>

                <View style={{justifyContent: 'center'}}>
                    <Text>Bet Size: {boardState['minBetSize']} $</Text>
                </View>

                <View style={styles.potContainer}>
                    <Text>Pot: {boardState['potSize']}$</Text>
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
      backgroundColor: COLORS.base500,
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