import { Children } from "react";
import { Modal, StyleSheet, View } from "react-native";

export default function PopUpModal({modalOpen, setModalOpen, title}) {
    return (
        <Modal transparent={true} animationType="fade" visible={modalOpen} onRequestClose={() => setModalOpen(!modalOpen)}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                </View>

                <View style={styles.bodyContainer}>
                    {Children}
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        minHeight: '50%',
        backgroundColor: 'white',
        borderRadius: 50
    },
    titleContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    titleText: {
        fontSize: 15
    }
})