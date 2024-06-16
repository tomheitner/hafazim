import { Modal, StyleSheet, Text, View } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";

export default function ColorPickerModal({ onChangeColor, modalOpen, setModalOpen }) {
    return (
        <Modal animationType="slide" onRequestClose={() => setModalOpen(false)} visible={modalOpen} transparent={true}>
            <View style={styles.mainContainer}>
                <View style={styles.contentContainer}>
                    <View style={styles.pickerContainer}>
                        <ColorPicker color="black" swatchesOnly={true} swatches={4} palette={['#000000','#888888', '#FFFF','#ed1c24','#d11cd5','#1633e6','#00aeef','#00c85d','#ffde17']} onColorChangeComplete={color => onChangeColor(color)}/>

                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        height: '50%',
        width: '90%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    pickerContainer: {
        flexDirection: 'row',
        width: '80%',
        // backgroundColor: 'red'
    }
})