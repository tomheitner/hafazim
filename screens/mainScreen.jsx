import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../consts';
import { useEffect, useState } from 'react';
import TableSection from '../Components/TableSection';
import { callApi } from '../mock-server/callApi';
import PlayerSection from '../Components/PlayerSection';
import OtherPlayerSection from '../Components/OtherPlayerSection';


export default function MainScreen() {
    const [ataPlayer, setAtaPlayer] = useState({});
    const [boardState, setBoardState] = useState({});
    const [otherPlayers, setOtherPlayers] = useState({1: {}, 2: {}});

    //Init
    useEffect(() => {
        const output = callApi('initGame');
        console.log(output);

        // parse into state
        setBoardState({
            turnNumber: output['turnNumber'],
            potSize: output['potSize'],
            tableKlafs: output['tableKlafs']
        })
        setAtaPlayer(output['ataPlayer']);
        setOtherPlayers(output['otherPlayers'])
    }, [])

    function changeTurn() {
        // get new turn number
        const output = callApi('nextTurn', JSON.stringify({turnNumber: boardState.turnNumber}));
        const newBoardState = {...boardState};
        newBoardState['turnNumber'] = output;
        setBoardState(newBoardState);
    }


    return (
        <View style={[styles.mainContainer]}>

            <View style={styles.topRow}>
                <OtherPlayerSection player={otherPlayers['1']} boardState={boardState}/>
                <OtherPlayerSection player={otherPlayers['2']} boardState={boardState}/>
            </View>


            <View style={styles.midRow}>
                <TableSection boardState={boardState}/>
            </View>

            <View style={styles.bottomRow}>
                <PlayerSection player={ataPlayer} boardState={boardState} changeTurn={changeTurn}/>
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