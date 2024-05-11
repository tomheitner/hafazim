import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { COLORS } from '../consts';
import HefezKlaf from './HefezKlaf';
import { globalStyles } from '../globalStyles';


export default function TableSection({boardState, NextTurnOther}) {
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
                <TouchableOpacity style={globalStyles.genericButton} onPress={NextTurnOther}>
                    <Text>▶️</Text>
                </TouchableOpacity>
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