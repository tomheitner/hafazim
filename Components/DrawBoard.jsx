import { useRef } from "react";
import { Text, TouchableHighlight, View, StyleSheet } from "react-native";
import SignatureScreen from 'react-native-signature-canvas';
import { globalStyles } from "../globalStyles";
import { COLORS } from "../consts";

export default function DrawBoard() {
    const ref = useRef();

    function onDraw() {
        ref.current.draw();
    }

    function onErase() {
        ref.current.erase();
    }

    return (
        <View style={styles.mainContainer}>
            <View style={styles.canvasContainer}>
                <SignatureScreen
                    ref={ref}

                />

            </View>

            <View>
                <TouchableHighlight style={globalStyles.genericButton} onPress={onDraw}>
                    <Text>Draw</Text>
                </TouchableHighlight>

                <TouchableHighlight style={globalStyles.genericButton} onPress={onErase}>
                    <Text>Delete</Text>
                </TouchableHighlight>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: COLORS.base300,
        borderColor: 'red'
    },
    canvasContainer: {
        backgroundColor: 'green'
    }
})