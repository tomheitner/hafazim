import { Button, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../consts';
import { useEffect, useState } from 'react';
import TableSection from '../Components/TableSection';
import { callApi } from '../mock-server/callApi';
import PlayerSection from '../Components/PlayerSection';
import OtherPlayerSection from '../Components/OtherPlayerSection';
import io from 'socket.io-client';
import SocketListeners from '../Components/SocketListeners';


const socket = io('http://192.168.1.110:5000');  // Adjust the URL as needed

export default function MainScreen() {
    const [boardState, setBoardState] = useState({});
    const [players, setPlayers] = useState({ 0: {}, 1: {}, 2: {} });
    const [roomId, setRoomId] = useState(null)

    //Init
    useEffect(() => {
        console.log('useEffect');
        socket.emit('init_game', {})
    }, [])

    
    // Server Listeners
    useEffect(() => {
        // --SERVER LISTENERS--
        socket.on('update_room', data => {
            console.log('update room to ', data);
            // parse into state
            setBoardState(data['board'])
            // setAtaPlayer(data['ataPlayer']);
            // setOtherPlayers(data['otherPlayers'])
            setPlayers(data['players'])
            setRoomId(data['roomId'])
        });




        return () => {
            socket.off('init_game');
        }
    }, [])

    function changeTurnOld(betAmount) {

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

    function changeTurn(betAmount) {
        const input = {
            'betAmount': betAmount,
            'roomId': roomId
        }
        socket.emit('next_turn', input)
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
        console.log('called add chips');
        const input = { chips: chipsAmount }
        socket.emit('add_chips', input)
    }


    return (
        <View style={[styles.mainContainer]}>

            <View style={styles.topRow}>
                <OtherPlayerSection player={players[1]} boardState={boardState} />
                <OtherPlayerSection player={players[2]} boardState={boardState} />
            </View>


            <View style={styles.midRow}>
                <TableSection boardState={boardState} players={players} changeTurn={changeTurn} finishGame={finishGame}/>
                {/* <Button title='add_chips' onPress={() => socket.emit('show_rooms', {})} /> */}
            </View>

            <View style={styles.bottomRow}>
                <PlayerSection player={players[0]} boardState={boardState} changeTurn={changeTurn} />
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