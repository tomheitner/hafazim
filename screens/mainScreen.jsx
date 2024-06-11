import { Button, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../consts';
import { useEffect, useState } from 'react';
import TableSection from '../Components/TableSection';
import { callApi } from '../mock-server/callApi';
import PlayerSection from '../Components/PlayerSection';
import OtherPlayerSection from '../Components/OtherPlayerSection';
// import io from 'socket.io-client';
import { socket } from '../socketConnector';
import SlideShowModal from '../Components/SlideShowModal';

import BackGroundImage from '../assets/images/bg.png'


export default function MainScreen({ route, navigation }) {
    const [boardState, setBoardState] = useState({});
    const [players, setPlayers] = useState([]);
    const [ataPlayerNumber, setAtaPlayerNumber] = useState(null);
    const [roomId, setRoomId] = useState(null)
    const [modalOpen, setModalOpen] = useState(false);

    const { roomIdFromNav } = route.params;

    useEffect(() => {
        console.log('ataPlayerNumber Changed to ', ataPlayerNumber);
    }, [ataPlayerNumber])

    // --Server Listeners--
    useEffect(() => {


        // Set listerners
        socket.on('update_room', onUpdateRoom);
        // socket.on('my_player_number', onGetPlayerNumber);


        // Cancel listeners on shutdown
        return () => {
            socket.off('update_room');
            // socket.off('my_player_number');
        }
    }, [])

    // Init
    useEffect(() => {
        if (roomId === null) {
            console.log('roomId is null');
            setRoomId(roomIdFromNav)
        }
        if (roomId !== null) {
            console.log('--init: sending update_room to server with roomId:', roomId);
            socket.emit('get_room', { 'roomId': roomId })
        }
    }, [roomId])

    // UTILITY
    function onUpdateRoom(data) {
        console.log('--server sent update_room with data ', data);
        console.log('-- while ataPlayerNumber is ', ataPlayerNumber);
        // parse into state
        setBoardState(data['board'])
        setPlayers(data['players'])
        if (ataPlayerNumber === null) {
            console.log('ataPlayerNumber is null: ', ataPlayerNumber);
            if ('ataPlayerNumber' in data) {
                setAtaPlayerNumber(data['ataPlayerNumber'])
            }
        }
        // setRoomId(data['roomId'])
    }


    // API POST functions
    function changeTurn(betAmount) {
        const input = {
            'betAmount': betAmount,
            'roomId': roomId
        }
        socket.emit('next_turn', input)
    }

    function handleFold() {
        const data = {
            'roomId': roomId,
            'playerNumber': ataPlayerNumber,
        }
        console.log('calling fold to server with data', data);
        socket.emit('fold', data);
    }

    function handleVote(playerNumber) {
        const data = {
            'roomId': roomId,
            'playerNumber': playerNumber
        }
        console.log('calling recieve_vote with data ', data);
        socket.emit('recieve_vote', data)
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


    return (
        <View style={[styles.mainContainer]}>
            <ImageBackground source={BackGroundImage}>
                <SlideShowModal players={players} ataPlayerNumber={ataPlayerNumber} handleVote={handleVote} modalOpen={modalOpen} setModalOpen={setModalOpen} boardState={boardState} />

                <View style={styles.topRow}>
                    {players.map((item, i) => {
                        if (item['playerNumber'] !== ataPlayerNumber) return <OtherPlayerSection key={i} player={item} boardState={boardState} />
                        // return <OtherPlayerSection key={i} player={item} boardState={boardState} />
                    })}
                </View>


                <View style={styles.midRow}>
                    <TableSection boardState={boardState} players={players} changeTurn={changeTurn} finishGame={finishGame} navigation={navigation} roomId={roomId} ataPlayerNumber={ataPlayerNumber} setModalOpen={setModalOpen} />
                    {/* <Button title='add_chips' onPress={() => socket.emit('list_rooms')} /> */}
                </View>

                <View style={styles.bottomRow}>
                    {ataPlayerNumber !== null ?
                        <PlayerSection player={players[ataPlayerNumber]} boardState={boardState} changeTurn={changeTurn} handleFold={handleFold} />
                        : null
                    }
                </View>
            </ImageBackground>
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