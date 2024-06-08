import { Modal, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { globalStyles } from "../globalStyles";
import ImageSlider from "./ImageSlider";

export default function SlideShowModal({ modalOpen, setModalOpen, players, ataPlayerNumber, handleVote, boardState }) {

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
                    <Text>Close</Text>
                </TouchableHighlight>

                <ImageSlider players={players} ataPlayerNumber={ataPlayerNumber} handleVote={handleVote} boardState={boardState}/>
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