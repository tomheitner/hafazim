import { Modal, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { globalStyles } from "../globalStyles";
import ImageSlider from "./ImageSlider";
import { useContext } from "react";
import { GameContext } from "../gameContext";

export default function SlideShowModal({ modalOpen, setModalOpen, handleVote }) {

    const {boardState, players, ataPlayerNumber} = useContext(GameContext)

    return (
        <Modal
            style={styles.modalContainer}
            animationType="slide"
            transparent={false}
            visible={modalOpen}
            onRequestClose={() => {
                setModalOpen(!modalOpen);
            }}>
            <View style={styles.mainContainer}>
                <TouchableHighlight style={globalStyles.genericButton} onPress={() => setModalOpen(false)}>
                    <Text style={globalStyles.buttonText}>Close</Text>
                </TouchableHighlight>

                <ImageSlider handleVote={handleVote}/>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        height: '100%',
        backgroundColor: 'blue',
        justifyContent: 'center'
    },
    mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'red',
        height: '90%'
    }
})