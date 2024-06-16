import React, { useContext, useState } from 'react';
import { StyleSheet, TextInput, View, Image, Text, Button, ImageBackground } from 'react-native';
import Sign from './Sign';
import { socket } from '../socketConnector';
import BackgroundImage from '../assets/images/bg-canvas.png';
import {GameContext} from '../gameContext'




export default function DrawScreen({ navigation }) {
  const [signature, setSign] = useState(null);

  const {roomId, ataPlayerNumber} = useContext(GameContext)

  function finishDrawing() {
    socket.emit('submit_drawing', { 'roomId': roomId, 'playerNumber': ataPlayerNumber, 'drawingData': signature });
    navigation.navigate('Main', {});
  }

  const handleSignature = signature => {
    console.log(signature);
    console.log('CLICKED CONFIRM');
    setSign(signature);
    setDesc("sign success");
  };

  return (
    <View style={styles.mainContainer}>
      <ImageBackground source={BackgroundImage}>
        <Sign
          onOK={handleSignature}
          handleFinish={finishDrawing}
          text={desc}
        />
        
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: 'green',
  },
  preview: {
    height: 50,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    flex: 1,
  },
  previewText: {
    color: "#FFF",
    fontSize: 14,
    height: 40,
    lineHeight: 40,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#69B2FF",
    width: 120,
    textAlign: "center",
    marginTop: 10
  }
});