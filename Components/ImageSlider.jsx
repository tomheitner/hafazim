import React, { useState } from 'react';
import {
    View, Image, StyleSheet, SafeAreaView, ScrollView, Dimensions, Text,
    TouchableOpacity
} from 'react-native';
import { globalStyles } from '../globalStyles';

export default function ImageSlider({players, ataPlayerNumber, handleVote, boardState}) {

    const { width } = Dimensions.get('window');
    const height = width * 0.7;

    const [active, setActive] = useState(0);

    const onScrollChange = ({ nativeEvent }) => {
        const slide = Math.ceil(
            nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
        );
        if (slide !== active) {
            setActive(slide);
        }
    };

    return (
        <View>
            <ScrollView
                pagingEnabled
                horizontal
                onScroll={onScrollChange}
                showsHorizontalScrollIndicator={false}
                style={{ width, height }}>
                {players.map((player, index) => (
                    (boardState['winnerVotes'][index] !== null) ?
                    <View key={index}>
                        <Image                            
                            source={{ uri: player['drawing'] }}
                            style={{ width, height, resizeMode: 'cover' }}
                        />

                        <TouchableOpacity onPress={() => handleVote(player['playerNumber'])} style={[globalStyles.genericButton, (player['playerNumber'] === ataPlayerNumber && globalStyles.disabled)]} disabled={player['playerNumber'] === ataPlayerNumber}>
                            <Text style={globalStyles.buttonText}>Vote</Text>
                        </TouchableOpacity>
                    </View>
                    : null
                ))}
            </ScrollView>
            <View style={styles.pagination}>
                {players.map((i, k) => (
                    <Text key={k} style={k == active ? styles.activeDot : styles.dot}>
                        •
                    </Text>
                ))}
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: -15,
        alignSelf: 'center',
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