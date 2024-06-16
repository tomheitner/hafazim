import React, { useContext, useState } from 'react';
import {
    View, Image, StyleSheet, SafeAreaView, ScrollView, Dimensions, Text,
    TouchableHighlight,
    ImageBackground
} from 'react-native';
import { GameContext } from '../gameContext';
import HefezKlaf from './HefezKlaf';
import { globalStyles } from '../globalStyles';
import BGImage from '../assets/images/bg-gallery.png'

const { width, height } = Dimensions.get('window');
// const height = width * 0.7;

const ImageSlider = ({ handleVote, setModalOpen }) => {

    const { players, ataPlayerNumber } = useContext(GameContext)


    const [active, setActive] = useState(0);

    const onScrollChange = ({ nativeEvent }) => {
        const slide = Math.ceil(
            nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
        );
        if (slide !== active) {
            setActive(slide);
        }
    };

    function onVote(playerNumber) {
        handleVote(playerNumber);
        setModalOpen(false);

    }

    return (
        <View>
            <ImageBackground source={BGImage}>

                <ScrollView
                    pagingEnabled
                    horizontal
                    onScroll={onScrollChange}
                    showsHorizontalScrollIndicator={false}
                    style={styles.scrollContainer}>
                    {players && players.map((player, index) => (
                        <View key={index} style={styles.contentContainer}>

                            <Text style={styles.title}>
                                {player['drawing']['title']}
                            </Text>

                            <Image
                                key={index}
                                source={{ uri: player['drawing']['data'] }}
                                style={styles.image}
                            />

                            <View style={styles.klafsRow}>
                                {player['selectedKlafs'].map((klaf, index) => {
                                    return <HefezKlaf title={klaf} moreCardStyles={{ width: width * 0.18 }} key={index} />
                                })}
                            </View>


                            <Text style={styles.description}>
                                {player['drawing']['description']}
                            </Text>

                            <View style={styles.buttonsRow}>
                                <TouchableHighlight onPress={() => onVote(player['playerNumber'])} disabled={index === ataPlayerNumber} style={[globalStyles.genericButton, { width: width * 0.3 }, index === ataPlayerNumber && globalStyles.disabled]}>
                                    <Text>Vote</Text>
                                </TouchableHighlight>
                            </View>

                        </View>
                    ))}
                </ScrollView>

                <View style={styles.pagination}>
                    {players.map((i, k) => (
                        <Text key={k} style={k == active ? styles.activeDot : styles.dot}>
                            •
                        </Text>
                    ))}
                </View>
            </ImageBackground>
        </View>
    );
}


const styles = StyleSheet.create({
    scrollContainer: {
        backgroundColor: 'brown',
        width: width,
        height: height
    },
    contentContainer: {
        // backgroundColor: 'green',
        height: height * 0.95,
    },
    title: {
        paddingTop: 10,
        fontSize: 30,
        textAlign: 'center'
    },
    description: {
        height: height * 0.2,
        padding: 10,
        fontSize: 14,
    },
    image: {
        borderWidth: 1,
        borderColor: 'black',
        width: width,
        height: height * 0.45,
        resizeMode: 'contain',
        // backgroundColor: 'purple',
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: -15,
        alignSelf: 'center',
    },
    klafsRow: {
        paddingTop: 10,
        flexDirection: 'row',
        // justifyContent: 'center',
        gap: 10,
        height: height * 0.14,
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    dot: {
        color: '#888',
        fontSize: 50,
    },
    activeDot: {
        color: '#FFF',
        fontSize: 50,
    },
});

export default ImageSlider;