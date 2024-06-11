import { StyleSheet } from "react-native";
import { COLORS, colorOpacity } from "./consts";

export const globalStyles = StyleSheet.create({
    genericButton: {
        backgroundColor: COLORS.base100,
        backgroundColor: COLORS.primary,
        borderWidth: 1,
        borderColor: COLORS.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        // alignSelf: 'flex-start',
        width: 50,
        height: 50,
    },
    buttonText: {
        color: COLORS.base300
    },
    chosenOutline: {
        borderWidth: 1,
        borderColor: 'red'
    },
    disabled: {
        opacity: 0.5,
        borderColor: 'gray'
    }
})