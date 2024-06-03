import { useState } from "react";
import { TextInput, TouchableHighlight, View, Text, StyleSheet } from "react-native";
import { COLORS } from "../consts";
import { globalStyles } from "../globalStyles";
import { socket } from "../socketConnector";

export default function InitScreen({route, navigation}) {
    const [roomNum, setRoomNum] = useState('BLBL')
    // const {socket} = route.params;

    function handleCreateRoom() {
        const data = {'roomId': roomNum};
        socket.emit('create_room', data);
        navigation.navigate('Main', {roomIdFromNav: roomNum});
    }

    function handleJoinRoom() {
        const data = {'roomId': roomNum};
        socket.emit('add_player_to_room', data);
        navigation.navigate('Main', {roomIdFromNav: roomNum});
    }



    function handleChange(e) {
        setRoomNum(Number(e.nativeEvent.text));
    }
    return (
        <View style={styles.mainContainer}>

            <View style={styles.buttonsRow}>
            <TouchableHighlight style={globalStyles.genericButton} onPress={handleCreateRoom}>
                <Text>New Room</Text>
            </TouchableHighlight>

            <TouchableHighlight style={globalStyles.genericButton} onPress={handleJoinRoom}>
                <Text>Join Room</Text>
            </TouchableHighlight>
            </View>

            <View style={styles.bottomRow}>
                <TextInput keyboardType="numeric"  onChange={e => handleChange(e)} placeholder="Room#" style={[globalStyles.genericButton, {width: 70, textAlign: 'center'}]}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.base300,
        justifyContent: 'center'
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
    }
})