import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LinearGradient } from "expo-linear-gradient";

export default function Timer() {
    return(
        <SafeAreaView style={styles.container}>
            <LinearGradient 
                colors={['#0084FF','#16B4F8', '#8CDCF9', '#FFFFFF']}
                style={styles.background}
            />
            <View style={{paddingHorizontal: 20}}>
                <Text style={styles.header}>Pomodoro Timer</Text>
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
    },
    addTaskBTN: {
        position: 'absolute',
        bottom: 10,
        right: 2
    }
});