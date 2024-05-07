import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS } from '../consts';
import HefezKlaf from './HefezKlaf';
import { globalStyles } from '../globalStyles';


export default function TableCard() {
    return (
        <View style={[styles.mainContainer]}>            

            <View style={styles.midRow}>
                <HefezKlaf moreCardStyles={styles.klaf}/>
                <HefezKlaf moreCardStyles={styles.klaf}/>
                <HefezKlaf moreCardStyles={styles.klaf}/>
                <HefezKlaf moreCardStyles={styles.klaf}/>
                <HefezKlaf moreCardStyles={styles.klaf}/>
            </View>

            <View style={styles.bottomRow}>
                <View style={styles.potContainer}>
                    <Text>Pot: 900$</Text>
                </View>
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
      justifyContent: 'space-between',
    },
    bottomRow: {
        width: '100%',
        height: '20%',
        flexDirection: 'row',
        justifyContent: 'flex-end',

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