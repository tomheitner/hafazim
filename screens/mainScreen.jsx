import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../consts';
import { useEffect, useState } from 'react';
import TableSection from '../Components/TableSection';
import { callApi } from '../mock-server/callApi';
import PlayerSection from '../Components/PlayerSection';
import OtherPlayerSection from '../Components/OtherPlayerSection';


export default function MainScreen() {
    const [boardState, setBoardState] = useState({});
    const [players, setPlayers] = useState({0: {}, 1: {}, 2: {}});

    //Init
    useEffect(() => {
        const data = callApi('initGame');
        console.log('init game data: ', data);

        // parse into state
        setBoardState(data['boardState'])
        // setAtaPlayer(data['ataPlayer']);
        // setOtherPlayers(data['otherPlayers'])
        setPlayers(data['players'])
    }, [])

    function changeTurn(betAmount) {

        // Other Players
        if (betAmount === null) {
            betAmount = Math.floor(Math.random() * 10);
        }

        const input = {
            boardState: boardState,
            player: players[boardState['turnNumber']],
            betAmount: betAmount
        }

        const output = callApi('nextTurn', JSON.stringify(input));

        console.log('New turn data: ', output);

        // update state
        setBoardState(output['boardState']);

        const newPlayers = {...players};
        newPlayers[output['player']['playerNumber']] = output['player']
        setPlayers(newPlayers);
    }


    return (
        <View style={[styles.mainContainer]}>

            <View style={styles.topRow}>
                <OtherPlayerSection player={players['1']} boardState={boardState}/>
                <OtherPlayerSection player={players['2']} boardState={boardState}/>
            </View>


            <View style={styles.midRow}>
                <TableSection boardState={boardState} changeTurn={changeTurn}/>
            </View>

            <View style={styles.bottomRow}>
                <PlayerSection player={players['0']} boardState={boardState} changeTurn={changeTurn}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.base300,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    topRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        height: '25%'
    },
    midRow: {
        flexDirection: 'row',
        height: '40%',
        alignItems: 'center',
    },
    bottomRow: {
        flexDirection: 'row',
        height: '35%',
    }
});