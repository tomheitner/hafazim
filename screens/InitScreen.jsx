import { useCallback, useContext, useEffect, useState } from "react";
import { TextInput, TouchableHighlight, View, Text, StyleSheet, Button, ImageBackground } from "react-native";
import { COLORS } from "../consts";
import { globalStyles } from "../globalStyles";
import { socket, changeSocket, IP_ADDRESS } from "../socketConnector";
import { GameContext } from "../gameContext";
import { useFocusEffect } from "@react-navigation/native";
import BGImage from "../assets/images/bg-canvas.png"

const ROOM_PLAYERS = 2; // the amount of players needed to open a room

export default function InitScreen({ route, navigation }) {
    const [roomNum, setRoomNum] = useState('BLBL');
    const [customIp, setCustomIp] = useState(IP_ADDRESS);
    const [waitingMode, setWaitingMode] = useState(false) // flag for waiting for players to join room
    const [playersInRoom, setPlayersInRoom] = useState(1);

    const { setRoomId } = useContext(GameContext);

    // Server listeners
    useEffect(() => {

        function onUpdateRoom(data) {
            console.log('--[init] server sent added_player with data: ', data);
            setPlayersInRoom(data['players'].length)

            if (data['players'].length >= ROOM_PLAYERS) {
                handleStartGame()
            }
        }

        socket.on('added_player', onUpdateRoom)

        return () => {
            socket.off('added_player')
        }
    })

    useFocusEffect(
        useCallback(() => {
            setRoomId(null)
        }, [])
    )

    function handleStartGame() {
        navigation.navigate('Main', { roomIdFromNav: roomNum });
    }


    function handleCreateRoom() {
        const data = { 'roomId': roomNum };
        socket.emit('create_room', data);
        setWaitingMode(true);
    }

    function handleJoinRoom() {
        const data = { 'roomId': roomNum };
        socket.emit('add_player_to_room', data);
        socket.emit('get_room', data);
        setWaitingMode(true);
    }

    function handleChangeRoomNum(text) {
        setRoomNum(text);
        setWaitingMode(false);
    }
    return (
        <View style={styles.mainContainer}>
            <ImageBackground source={BGImage}>


                <View style={{ height: '90%', justifyContent: 'center' }}>


                    <View style={styles.buttonsRow}>
                        <TouchableHighlight style={globalStyles.genericButton} onPress={handleCreateRoom}>
                            <Text style={globalStyles.buttonText}>New Room</Text>
                        </TouchableHighlight>

                        <TouchableHighlight style={globalStyles.genericButton} onPress={handleJoinRoom}>
                            <Text style={globalStyles.buttonText}>Join Room</Text>
                        </TouchableHighlight>
                    </View>

                    <View style={styles.bottomRow}>
                        <TextInput keyboardType="numeric" onChangeText={text => handleChangeRoomNum(text)} placeholder="Room#" style={[globalStyles.genericButton, globalStyles.buttonText, { width: 70, textAlign: 'center' }]} />
                    </View>

                    <View style={styles.statusContainer}>
                        {waitingMode ?
                            <Text>{`Waiting for players to join (${playersInRoom} / ${ROOM_PLAYERS})`}</Text>
                            : null
                        }
                    </View>

                </View>
                <View style={styles.footer}>
                    <Text>Server IP: </Text>
                    <TextInput style={{ borderWidth: 1, width: '60%', paddingLeft: 3 }} value={customIp} onChangeText={text => setCustomIp(text)} />
                    <Button title="Change" onPress={() => changeSocket(customIp)} />
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: COLORS.base300,
        // justifyContent: 'center'
    },
    buttonsRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    bottomRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginTop: 30
    },
    footer: {
        height: '10%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    }
})