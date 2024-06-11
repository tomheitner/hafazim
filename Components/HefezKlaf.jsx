import { StyleSheet, Text, View } from 'react-native';
import { COLORS, colorOpacity } from '../consts';

export default function HefezKlaf({moreTextStyles, moreCardStyles, title=null}) {
    return (
        <View style={[styles.container, moreCardStyles]}>
            <Text style={[styles.klafText, moreTextStyles]}>
                {title === null ? 'חפץ' : title}
            </Text>
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
      alignItems: 'center',
      justifyContent: 'center',
      width: '23%',
      height: '100%',
    },
    klafText: {
        fontSize: 25,
        color: COLORS.highlight
    }
  });