import { StyleSheet, Text, View } from 'react-native';
import PlayerCard from '../Components/PlayerCard';
import { COLORS } from '../consts';
import OtherPlayerCard from '../Components/OtherPlayerCard';
import { useState } from 'react';


export default function MainScreen() {
    const [turn, setTurn] = useState(0);

    function nextTurn() {
        if (turn < 2) {
            setTurn(turn + 1)
        }
        else {
            setTurn(0)
        }
    }

    return (
        <View style={[styles.mainContainer, {marginTop: '20%'}]}>
            <View style={styles.topRow}>
                <OtherPlayerCard turnNumber={1} turn={turn}/>
                <OtherPlayerCard turnNumber={2} turn={turn}/>
            </View>

            <View>
                
            </View>
            
            <PlayerCard turn={turn} nextTurn={nextTurn}/>
            <View />
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: COLORS.base300,
      alignItems: 'center'
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: '40%'
    }
  });