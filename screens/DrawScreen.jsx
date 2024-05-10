import { SketchCanvas } from "@wwimmo/react-native-sketch-canvas";
import { View, StyleSheet } from "react-native";


export default function DrawScreen() {
    return (
        <View style={styles.container}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <SketchCanvas style={{ flex: 1 }} strokeColor={"red"} strokeWidth={7} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    }
})