import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS, colorOpacity } from '../consts';
import HefezImage from '../assets/card-sets/draw-set/kise.png'

export default function HefezKlaf({ moreTextStyles, moreCardStyles, title = null }) {
    return (
        <View style={[styles.container, moreCardStyles]}>
            <View style={styles.topRow}>
                <Text style={[styles.klafText, styles.topText, moreTextStyles]}>
                    {title === null ? 'חפץ' : title}
                </Text>
            </View>

            <View style={styles.bodyContainer}>
                <Image source={HefezImage} style={styles.image}/>
            </View>

            <View style={styles.bottomRow}>
                <Text style={[styles.klafText, styles.bottomText, moreTextStyles]}>
                    {title === null ? 'חפץ' : title}
                </Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        //   backgroundColor: COLORS.base100,
        backgroundColor: colorOpacity(COLORS.neutral, 0.8),
        borderColor: COLORS.accent,
        borderWidth: 1,
        elevation: 2,
        borderRadius: 10,
        paddingHorizontal: 4,
        // paddingVertical: 1,
        // justifyContent: 'space-between',
        justifyContent: 'center',
        width: '23%',
        height: '100%',

    },
    klafText: {
        fontSize: 15,
        color: COLORS.highlight,
        // color: 'red',
    },
    topRow: {
        position: 'absolute',
        zIndex: 1,
        top: 1,
        right: 3,
        flexDirection: 'row',
        // backgroundColor: 'red',
        width: '100%',
        justifyContent: 'flex-end'
    },
    bottomRow: {
        position: 'absolute',
        zIndex: 1,
        bottom: 1,
        right: 5,
        flexDirection: 'row',
        width: '100%',
        // backgroundColor: 'blue',
        
        
    },
    bottomText: {
        textAlign: 'left',
        transform: [{rotateX: '180deg'}, {rotateY: '180deg'}],
    },
    topText: {
        
    },
    image: {
        resizeMode: 'cover',
        height: '100%',
        width: '100%',
    },
    bodyContainer: {
        width: '100%',
        height: '80%',
        // backgroundColor: 'blue',
    }
});