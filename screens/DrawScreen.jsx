import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Button, TextInput, TouchableOpacity, Text, ImageBackground } from 'react-native';
import { globalStyles } from '../globalStyles';
import SignatureScreen from 'react-native-signature-canvas';
import { COLORS } from '../consts';
import ColorPickerModal from '../Components/ColorPickerModal';
import InputModal from '../Components/InputModal';
import { GameContext } from '../gameContext';
import HefezKlaf from '../Components/HefezKlaf';
import BackgroundImage from '../assets/images/bg-canvas.png';
import { socket } from '../socketConnector';


export default function DrawScreen({ navigation }) {
  
  
  const [colorModalOpen, setcolorModalOpen] = useState(false);
  const [descModalOpen, setDescModalOpen] = useState(false);
  
  const [chosenColor, setChosenColor] = useState('black')
  const [bigPen, setBigPen] = useState(false);
  
  const [drawingData, setDrawingData] = useState(null);
  const [drawingTitle, setDrawingTitle] = useState(null);
  const [drawingDescription, setDrawingDescription] = useState(null);
  
  const [selectedKlafs, setSelectedKlafs] = useState([]);
  
  const { players, ataPlayerNumber, boardState, roomId } = useContext(GameContext);


  const ref = useRef();

  useEffect(() => {
    // get player state from the server and update local state accordingly
    if (ataPlayerNumber !== null) {
      console.log('--got player data from server, updating local state--');
      setSelectedKlafs(players[ataPlayerNumber]['selectedKlafs']);
      setDrawingData(players[ataPlayerNumber]['drawing']['data']);
      setDrawingTitle(players[ataPlayerNumber]['drawing']['title']);
      setDrawingDescription(players[ataPlayerNumber]['drawing']['description']);
    }
  }, [ataPlayerNumber])


  function finishDrawing() {
    const data = {
      'roomId': roomId,
      'playerNumber': ataPlayerNumber,
      'drawingData': {data: drawingData, title: drawingTitle, description: drawingDescription},
      'selectedKlafs': selectedKlafs,
    }
    socket.emit('submit_drawing', data);
    navigation.navigate('Main', {});
  }

  function handleUpdateDrawing(newDrawing) {
    // called when finishing new stroke and drawing is not empty
    setDrawingData(newDrawing);
  }


  // Canvas functions
  function onChangeColor(color) {
    setChosenColor(color);
    ref.current.changePenColor(color)
    setcolorModalOpen(false);
  }

  function changePenSize() {
    if (bigPen) {
      ref.current.changePenSize(1, 3)
      setBigPen(false);
    }
    else {
      ref.current.changePenSize(1, 10)
      setBigPen(true);
    }
  }

  function onFinishDrawing() {
    ref.current.readSignature();
    finishDrawing()

  }

  function finishDescription() {
    setDescModalOpen(false);
  }

  function handleSelectKlaf(klaf) {
    const newSelectKlafs = [...selectedKlafs];

    for (let i = 0; i < newSelectKlafs.length; i++) {
      if (newSelectKlafs[i] === klaf) {
        newSelectKlafs[i] = null;
        break;
      }
      else if (newSelectKlafs[i] === null && !newSelectKlafs.includes(klaf)) {
        newSelectKlafs[i] = klaf;
        break;
      }
    }

    setSelectedKlafs(newSelectKlafs);
  }

  return (
    <View style={styles.mainContainer}>
      <ImageBackground source={BackgroundImage}>


        <ColorPickerModal modalOpen={colorModalOpen} setModalOpen={setcolorModalOpen} onChangeColor={onChangeColor} />
        <InputModal modalOpen={descModalOpen} setModalOpen={setDescModalOpen} finishInput={finishDescription} inputState={drawingDescription} setInputState={setDrawingDescription} />

        <View style={styles.topRow}>
          <TextInput style={styles.title} onChangeText={text => setDrawingTitle(text)} value={drawingTitle} placeholder='Title'/>

          <TouchableOpacity style={globalStyles.genericButton} onPress={onFinishDrawing}>
            <Text style={globalStyles.buttonText}>Finish</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.canvasContainer}>
          <SignatureScreen
            ref={ref}
            onEnd={() => ref.current.readSignature()}
            onOK={newDrawing => handleUpdateDrawing(newDrawing)}
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

          dataURL={ataPlayerNumber !== null && players[ataPlayerNumber]['drawing']['data']}
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

          <TouchableOpacity style={styles.canvasButton} onPress={changePenSize}>
            <Text style={styles.canvasButtonText}>{bigPen ? '➖' : '➕'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.canvasButton} onPress={() => ref.current.clearSignature()}>
            <Text style={styles.canvasButtonText}>🚮</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.canvasButton} onPress={() => setDescModalOpen(true)}>
            <Text style={styles.canvasButtonText}>Description</Text>
          </TouchableOpacity>


        </View>

        <View>
          <Text> </Text>
        </View>

        <View style={styles.klafsRow}>
          {
            [...players[ataPlayerNumber]['klafs'], ...boardState['tableKlafs']].map((klaf, index) => {
              return (
                <TouchableOpacity disabled={klaf === null} onPress={() => handleSelectKlaf(klaf)} style={[{ width: '18%' }]} key={index}>
                  <HefezKlaf title={klaf} moreCardStyles={[{ width: '100%' }, (klaf !== null && selectedKlafs.includes(klaf)) && globalStyles.chosenOutline]} />
                </TouchableOpacity>
              )
            })
          }
        </View>
      </ImageBackground>
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
  },
  klafsRow: {
    flexDirection: 'row',
    width: '100%',
    height: '15%',
    justifyContent: 'space-evenly',
    borderColor: 'black',
    borderWidth: 1,
    padding: 10,
    // backgroundColor: 'red',
  },
});