import { Modal, StyleSheet } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";

export default function ColorPickerModal({onChangeColor, modalOpen, setModalOpen}) {
    return (
        <Modal
            style={styles.modalContainer}
            animationType="slide"
            transparent={false}
            visible={modalOpen}
            onRequestClose={() => {
                setModalOpen(!modalOpen);
            }}>

            <ColorPicker 
                onColorChangeComplete={color => onChangeColor(color)}
                discrete={true}
                wheelHidden={true}
                
                row={true}
            />

        </Modal >
    )
}

const styles = StyleSheet.create({
    modalContainer: {
        height: '50%',
        width: '90%',
        backgroundColor: 'purple'
    }
})