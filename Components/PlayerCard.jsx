import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS } from '../consts';
import HefezKlaf from './HefezKlaf';
import { globalStyles } from '../globalStyles';


export default function PlayerCard({turn, nextTurn}) {
    return (
        <View style={[styles.mainContainer, (turn === 0) && globalStyles.chosenOutline]}>

            <View style={styles.topRow}>
                <View style={styles.betContainer}>
                    <Text>Bet: 300$</Text>
                </View>
            </View>

            <View style={styles.midRow}>
                <HefezKlaf/>
                <HefezKlaf />
            </View>

            <View style={styles.bottomRow}>
                <TouchableOpacity style={globalStyles.genericButton} onPress={nextTurn}>
                    <Text>
                        Call
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyles.genericButton}>
                    <Text>
                        Fold
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyles.genericButton}>
                    <Text>
                        Raise
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
      width: '100%',
      height: '35%',
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
    }

  });