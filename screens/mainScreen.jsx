import { Button, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../consts';
import { useEffect, useState } from 'react';
import TableSection from '../Components/TableSection';
import { callApi } from '../mock-server/callApi';
import PlayerSection from '../Components/PlayerSection';
import OtherPlayerSection from '../Components/OtherPlayerSection';
// import io from 'socket.io-client';
import { socket } from '../socketConnector';


export default function MainScreen({ route, navigation }) {
    const [boardState, setBoardState] = useState({});
    const [players, setPlayers] = useState({ 0: {}, 1: {}, 2: {} });
    const [ataPlayerNumber, setAtaPlayerNumber] = useState(null);
    const [roomId, setRoomId] = useState(null)

    //Init
    useEffect(() => {
        if (roomId) socket.emit('get_player_number', { 'roomId': roomId })
    }, [roomId])


    // Server Listeners
    useEffect(() => {
        // --SERVER LISTENERS--
        socket.on('update_room', data => {
            console.log('update room to ', data);
            // parse into state
            setBoardState(data['board'])
            setPlayers(data['players'])
            setRoomId(data['roomId'])
        });

        socket.on('my_player_number', (data) => {
            console.log('got player number - ', data['playerNumber']);
            setAtaPlayerNumber(data['playerNumber']);
        })


        return () => {
            socket.off('update_room');
            socket.off('my_player_number');
        }
    }, [])

    function changeTurn(betAmount) {
        const input = {
            'betAmount': betAmount,
            'roomId': roomId
        }
        socket.emit('next_turn', input)
    }

    function finishGame(winner) { // **STILL USES MOCK API**
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
                {/* <OtherPlayerSection player={players[1]} boardState={boardState} /> */}
                {/* <OtherPlayerSection player={players[2]} boardState={boardState} /> */}
            </View>


            <View style={styles.midRow}>
                <TableSection boardState={boardState} players={players} changeTurn={changeTurn} finishGame={finishGame} />
                {/* <Button title='add_chips' onPress={() => socket.emit('list_rooms')} /> */}
            </View>

            <View style={styles.bottomRow}>
                {ataPlayerNumber !== null ?
                    <PlayerSection player={players[ataPlayerNumber]} boardState={boardState} changeTurn={changeTurn} />
                    : null
                }
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