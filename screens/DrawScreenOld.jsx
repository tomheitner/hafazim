import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import DrawBoard from "../Components/DrawBoard";
import SignatureScreen from 'react-native-signature-canvas';
import { useRef } from "react";
import { globalStyles } from "../globalStyles";

export default function DrawScreen() {   
    const ref = useRef();

    function onDraw() {
        ref.current.draw();
    }

    function onErase() {
        ref.current.erase();
    }

    const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;


    
    return (
        <View style={styles.mainContainer}>
            <View style={styles.canvasContainer}>
                <SignatureScreen 
                    ref={ref}
                    webStyle={style}
                    // style={styles.canvasContainer}
                />
            </View>

            <View style={styles.buttonsContainer}>
                <TouchableOpacity style={globalStyles.genericButton} onPress={onDraw}>
                    <Text>Draw</Text>
                </TouchableOpacity>

                <TouchableOpacity style={globalStyles.genericButton} onPress={onErase}>
                    <Text>Erase</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    canvasContainer: {
        height: '70%',
        width: '100%',
        backgroundColor: 'red'
    },
    buttonsContainer: {
        width: '100%',
        height: '30%',
        backgroundColor: 'green'
    }
})
