import { StyleSheet } from "react-native";
import { COLORS } from "./consts";

export const globalStyles = StyleSheet.create({
    genericButton: {
        backgroundColor: COLORS.base100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        // alignSelf: 'flex-start',
        width: 50,
        height: 50,
    },
    chosenOutline: {
        borderWidth: 1,
        borderColor: 'red'
    },
})