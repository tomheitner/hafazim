import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS } from '../consts';
import HefezKlaf from './HefezKlaf';
import { globalStyles } from '../globalStyles';


export default function OtherPlayerCard({turn, turnNumber}) {
    return (
        <View style={[styles.mainContainer, turn === turnNumber && globalStyles.chosenOutline]}>

            <View style={styles.midRow}>
                <HefezKlaf moreTextStyles={{fontSize: 15}}/>
                <HefezKlaf moreTextStyles={{fontSize: 15}}/>
            </View>

            <View style={styles.bottomRow}>
                <View style={styles.betContainer}>
                    <Text>Bet: 300$</Text>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
      width: '40%',
      height: '40%',
      paddingVertical: 10,
      paddingHorizontal: 5,
      backgroundColor: COLORS.base500,
    },
    bottomRow: {
        width: '100%',
        height: '47%',
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    midRow: {
        flexDirection: 'row',
        gap: 15,
        width: '100%',
        height: '60%',
    },
    betContainer: {
        backgroundColor: COLORS.base100,
        padding: 3,
        borderRadius: 10,
        justifyContent: 'center',
        width: '100%'
    }

  });