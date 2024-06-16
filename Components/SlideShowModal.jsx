import { Modal, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { globalStyles } from "../globalStyles";
import ImageSlider from "./ImageSlider";
import { useContext } from "react";
import { GameContext } from "../gameContext";

export default function SlideShowModal({ modalOpen, setModalOpen, handleVote }) {

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={modalOpen}
            onRequestClose={() => {
                setModalOpen(!modalOpen);
            }}>

            <ImageSlider handleVote={handleVote} setModalOpen={setModalOpen} />

        </Modal>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'red',
        height: '90%'
    }
})