import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LinearGradient } from "expo-linear-gradient";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { useState } from "react";

import { Ionicons } from '@expo/vector-icons';

export default function Timer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [key, setKey] = useState(0);
    const [timerMode, setTimerMode] = useState('pomodoro');
    const [duration, setDuration] = useState(25 * 60);

    const timerModes = {
        pomodoro: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
    };

    const handleTimerMode = (mode: keyof typeof timerModes) => {
        setTimerMode(mode);
        setDuration(timerModes[mode]);
    }

    // add notifs when timer end
    
    return(
        <SafeAreaView style={styles.container}>
            <LinearGradient 
                colors={['#0084FF','#16B4F8', '#8CDCF9', '#FFFFFF']}
                style={styles.background}
            />
            <View style={{paddingHorizontal: 20}}>
                <Text style={styles.header}>Pomodoro Timer</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: 15, paddingHorizontal: 20}}>
                <TouchableOpacity style={[styles.navBTN, timerMode === 'pomodoro' ? styles.activeNavBTN : null]}
                    onPress={() => handleTimerMode('pomodoro')}
                >
                    <Text style={{fontWeight: '600'}}>Pomodoro</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.navBTN, timerMode === 'shortBreak' ? styles.activeNavBTN : null]}
                    onPress={() => handleTimerMode('shortBreak')}
                >
                    <Text style={{fontWeight: '600'}}>Short Break</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.navBTN, timerMode === 'longBreak' ? styles.activeNavBTN : null]}
                    onPress={() => handleTimerMode('longBreak')}
                >
                    <Text style={{fontWeight: '600'}}>Long Break</Text>
                </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center', paddingTop: 40}}>
                <Text style={{paddingBottom: 30, fontWeight: '500', fontSize: 30}}>Time to Focus!</Text>
                <CountdownCircleTimer
                    isPlaying={isPlaying}
                    duration={duration}
                    colors={"#A6F511"}
                    updateInterval={0}
                    strokeWidth={22}
                    size={250}
                    key={key}
                >
                {({ remainingTime }) => (
                    <Text style={{ color: '#D5FF61', fontSize: 50, fontWeight: '700' }}>
                        {Math.floor(remainingTime / 60).toString().padStart(2, '0')}:
                        {Math.floor(remainingTime % 60).toString().padStart(2,'0')}
                    </Text>
                )}
                </CountdownCircleTimer>
                <View style={{flexDirection:'row', paddingTop: 40}}>
                    
                    <TouchableOpacity
                            onPress={() => {
                                setKey(prevKey => prevKey + 1); 
                                setIsPlaying(false);
                            }}
                    >
                        <Ionicons name="stop-circle" size={80} color="red" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setIsPlaying(!isPlaying)}
                    >
                        {isPlaying ? (
                            <Ionicons name="pause-circle" size={80} color="#0084FF" />
                        ) : (
                            <Ionicons name="play-circle" size={80} color="#0084FF" />
                        )}
                        
                    </TouchableOpacity>
                </View>
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
    navBTN: {
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        paddingHorizontal: 15
    },
    activeNavBTN: {
        backgroundColor: '#16B4F8'
    }
});