import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../consts';

export default function HefezKlaf({moreTextStyles, moreCardStyles}) {
    return (
        <View style={[styles.container, moreCardStyles]}>
            <Text style={[{fontSize: 25}, moreTextStyles]}>
                חפץ
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: COLORS.base100,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      width: '23%',
      height: '100%',
    },
  });