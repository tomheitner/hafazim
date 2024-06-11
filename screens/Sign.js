import React, { useRef } from 'react';
import { StyleSheet, View, Button, TextInput, TouchableOpacity, Text, ImageBackground } from 'react-native';
import { globalStyles } from '../globalStyles';
import SignatureScreen from 'react-native-signature-canvas';
import { COLORS } from '../consts';


export default function Sign({ onOK, handleFinish }) {
  const ref = useRef();

  const handleSignature = signature => {
    console.log(signature);
    onOK(signature);
  };

  const handleClear = () => {
    ref.current.clearSignature();
  }

  const undo = () => {
    ref.current.undo();
  };

  return (
    <View style={styles.mainContainer}>

      <View style={styles.topRow}>
        <TextInput style={styles.title} defaultValue='Title' />

        <TouchableOpacity style={globalStyles.genericButton} onPress={handleFinish}>
          <Text style={globalStyles.buttonText}>Finish</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.canvasContainer}>
        <SignatureScreen
          ref={ref}
          onOK={handleSignature}
          webviewContainerStyle={styles.canvas}
          webStyle={`
                .m-signature-pad {
                  background-color: transparent;
                }
                .m-signature-pad {
                  height: 90%;
                  box-shadow: none;
                  border-radius: 10px;
                }
                .m-signature-pad--footer {
                  display: none;
                }
                `}
        // dataURL={url}
        />
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.canvasButton} onPress={() => ref.current.draw()}>
          <Text style={styles.canvasButtonText}>✒️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.canvasButton} onPress={() => ref.current.erase()}>
          <Text style={styles.canvasButtonText}>🧼</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.canvasButton} onPress={() => ref.current.undo()}>
          <Text style={styles.canvasButtonText}>↩️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.canvasButton} onPress={() => ref.current.redo()}>
          <Text style={styles.canvasButtonText}>↪️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.canvasButton} onPress={() => ref.current.changePenColor('rgba(300,50,100,1)')}>
          <Text style={styles.canvasButtonText}>🎨</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.canvasButton} onPress={() => ref.current.changePenSize(1,10)}>
          <Text style={styles.canvasButtonText}>🪬</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.canvasButton} onPress={() => ref.current.clearSignature()}>
          <Text style={styles.canvasButtonText}>🚮</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.canvasButton} onPress={() => ref.current.readSignature()}>
          <Text style={styles.canvasButtonText}>💾</Text>
        </TouchableOpacity>


      </View>

      <View style={styles.klafsRow}>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    padding: 10,
    paddingTop: 35,
  },
  topRow: {
    width: '100%',
    height: '10%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 40,

  },
  title: {
    color: 'black',
    fontSize: 35

  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    // gap: 5,
    flexWrap: 'wrap'
  },
  canvasButton: {
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvasButtonText: {
    fontSize: 35
  },
  canvasContainer: {
    height: 350
  },
  canvas: {
    backgroundColor: 'transparent',
    borderColor: 'red',
    height: 350
    // backgroundColor: 'transparent'
  }
});