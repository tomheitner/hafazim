import { Button, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../consts';
import { useEffect, useState } from 'react';
import TableSection from '../Components/TableSection';
import { callApi } from '../mock-server/callApi';
import PlayerSection from '../Components/PlayerSection';
import OtherPlayerSection from '../Components/OtherPlayerSection';
import io from 'socket.io-client';


const socket = io('http://192.168.1.190:5000');  // Adjust the URL as needed

export default function MainScreen() {
    const [boardState, setBoardState] = useState({});
    const [players, setPlayers] = useState({ 0: {}, 1: {}, 2: {} });

    //Init
    useEffect(() => {
        // const data = callApi('initGame');
        // console.log('init game data: ', data);

        socket.emit('init_game', {})

        // // parse into state
        // setBoardState(data['boardState'])
        // // setAtaPlayer(data['ataPlayer']);
        // // setOtherPlayers(data['otherPlayers'])
        // setPlayers(data['players'])



    }, [])

    useEffect(() => {
        // --SERVER LISTENERS--
        socket.on('init_game', data => {
            console.log(data);
            // parse into state
            setBoardState(data['boardState'])
            // setAtaPlayer(data['ataPlayer']);
            // setOtherPlayers(data['otherPlayers'])
            setPlayers(data['players'])
        });


        return () => {
            socket.off('init_game');
        }
    }, [])

    function changeTurn(betAmount) {

        const input = {
            boardState: boardState,
            player: players[boardState['turnNumber']],
            betAmount: betAmount
        }

        const output = callApi('nextTurn', JSON.stringify(input));

        console.log('New turn data: ', output);

        // update state
        setBoardState(output['boardState']);

        const newPlayers = { ...players };
        newPlayers[output['player']['playerNumber']] = output['player']
        setPlayers(newPlayers);
    }

    function finishGame(winner) {
        const input = {
            boardState: boardState,
            players: players,
            winner: winner
        }

        const data = callApi('finishGame', JSON.stringify(input));

        // update state
        setBoardState(data.boardState);
        setPlayers(data.players);
    }

    // SERVER FUNCTIONS
    function handle_add_chips(chipsAmount) {
        const input = { chips: chipsAmount }
        socket.emit('init_game', input)
    }


    return (
        <View style={[styles.mainContainer]}>

            <View style={styles.topRow}>
                <OtherPlayerSection player={players['1']} boardState={boardState} />
                <OtherPlayerSection player={players['2']} boardState={boardState} />
            </View>


            <View style={styles.midRow}>
                {/* <TableSection boardState={boardState} changeTurn={changeTurn} finishGame={finishGame}/> */}
                <Button title='add_chips' onPress={() => handle_add_chips(50)} />
            </View>

            <View style={styles.bottomRow}>
                <PlayerSection player={players['0']} boardState={boardState} changeTurn={changeTurn} />
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