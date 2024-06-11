import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Button, TextInput, TouchableOpacity, Text, ImageBackground } from 'react-native';
import { globalStyles } from '../globalStyles';
import SignatureScreen from 'react-native-signature-canvas';
import { COLORS } from '../consts';
import ColorPickerModal from '../Components/ColorPickerModal';


export default function Sign({ onOK, handleFinish }) {

  const [colorModalOpen, setcolorModalOpen] = useState(false);
  const [chosenColor, setChosenColor] = useState('purple')

  const ref = useRef();

  useEffect(() => {
    console.log('color to ', chosenColor);
    ref.current.changePenColor(chosenColor)
  }, [chosenColor])


  const handleSignature = signature => {
    console.log(signature);
    onOK(signature);
  };

  function onChangeColor(color) {
    setChosenColor(color);
    setcolorModalOpen(false);
  }

  return (
    <View style={styles.mainContainer}>

      <ColorPickerModal modalOpen={colorModalOpen} setModalOpen={setcolorModalOpen} onChangeColor={onChangeColor}/>

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
                  height: 400px;
                  box-shadow: none;
                  border-radius: 10px;
                  border-width: 2px;
                  border-color: black;
                  border-style: dotted;
                  background-color: transparent;
                }
                .m-signature-pad--footer {
                  display: none;
                }
                .m-signature-pad--body {border: none;}
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

        <TouchableOpacity style={styles.canvasButton} onPress={() => setcolorModalOpen(true)}>
          <Text style={styles.canvasButtonText}>🎨</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.canvasButton} onPress={() => ref.current.changePenSize(1, 10)}>
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
    height: '60%'
  },
  canvas: {
    backgroundColor: 'transparent',
    height: 500
    // backgroundColor: 'transparent'
  }
});