import { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import { globalStyles } from "../globalStyles";

export default function InputModal({ modalOpen, setModalOpen, containerStyles, finishInput, inputState, setInputState }) {


    return (
        <Modal transparent={true} visible={modalOpen} onRequestClose={() => setModalOpen(false)}>
            <View style={styles.mainContainer}>
                <View style={styles.contentContainer}>

                    <Text style={{fontSize: 22}}>Description: </Text>

                    <View style={styles.inputContainer}>
                        <TextInput value={inputState} style={styles.textInput} onChangeText={input => setInputState(input)} multiline={true} />
                    </View>

                    <TouchableHighlight style={globalStyles.genericButton} onPress={finishInput}>
                        <Text>Save</Text>
                    </TouchableHighlight>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        padding: 3,
        height: '80%',
        width: '95%',
        backgroundColor: 'rgba(255,255,255, 0.9)'
    },
    inputContainer: {
        marginTop: 20,
        marginBottom: 20,
        padding: 7,
        borderWidth: 1,
        height: '80%',
        borderColor: 'black'
    },
    textInput: {
        height: '100%',
        textAlignVertical: 'top',
        fontSize: 22,
    }
})