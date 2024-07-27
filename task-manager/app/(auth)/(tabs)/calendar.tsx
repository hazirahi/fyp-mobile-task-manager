import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LinearGradient } from "expo-linear-gradient";

export default function Calendar() {
    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#A6F511', '#D5FF61', '#F6FF78', '#FFFFFF']}
                style={styles.background}
            />
            <View style={{paddingHorizontal: 20}}>
                <Text style={styles.header}>Calendar</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'white'
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 730
    },
    header: {
        fontFamily: 'EBGaramond',
        fontSize: 50,
        fontWeight: '600',
        paddingTop: 10
    }
});