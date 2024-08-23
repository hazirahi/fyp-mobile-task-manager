import { Text, View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { LinearGradient } from "expo-linear-gradient";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { useState, useRef } from "react";

import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import FocusTaskBottomSheet from "@/components/FocusTaskBottomSheet";
import { useTaskList } from "@/provider/TaskListProvider";

export default function Timer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [key, setKey] = useState(0);
    const [timerMode, setTimerMode] = useState('pomodoro');
    const [duration, setDuration] = useState(25 * 60);
    const [showModal, setShowModal] = useState(false);

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const handleOpenPress = () => bottomSheetRef.current?.present();
    const [focusTask, setFocusTask] = useState('Time to Focus!');
    const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);

    const { tasks, onCheckPressed } = useTaskList();

    const timerModes = {
        pomodoro: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
    };

    const handleTimerMode = (mode: keyof typeof timerModes) => {
        setTimerMode(mode);
        setDuration(timerModes[mode]);
    }

    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleTaskSelect = (taskName: string, taskId: number) => {
        setFocusTask(taskName);
        setCurrentTaskId(taskId);
        bottomSheetRef.current?.close();
    }
    
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
                <TouchableOpacity
                    onPress={() => {
                        handleOpenPress();
                    }}
                    style={{paddingBottom: 30}}
                >
                    <Text style={styles.focusTask}>{focusTask}</Text>
                    <Text style={{fontSize: 14, textAlign: 'center', fontWeight: '500'}}>(tap to switch task)</Text>
                </TouchableOpacity>
                <FocusTaskBottomSheet
                    ref={bottomSheetRef}
                    onTaskSelect={handleTaskSelect}
                />
                <CountdownCircleTimer
                    isPlaying={isPlaying}
                    duration={duration}
                    colors={"#A6F511"}
                    updateInterval={0}
                    strokeWidth={22}
                    size={250}
                    key={key}
                    onComplete={() => {
                        setShowModal(true);
                    }}
                >
                {({ remainingTime }) => (
                    <Text style={{ color: '#D5FF61', fontSize: 50, fontWeight: '700' }}>
                        {Math.floor(remainingTime / 60).toString().padStart(2, '0')}:
                        {Math.floor(remainingTime % 60).toString().padStart(2,'0')}
                    </Text>
                )}
                </CountdownCircleTimer>
                <Modal
                    visible={showModal}
                    onRequestClose={() => setShowModal(false)}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={styles.modalContainer}>
                        <Text style={{fontWeight: '500', fontSize: 17, paddingBottom: 10, textAlign: 'center', paddingTop: 20}}>your session has ended!</Text>
                        <Text style={{fontWeight: '400', fontSize: 15, textAlign: 'center', paddingBottom: 25}}>do you want to mark your current task as completed?</Text>
                        <View style={{flexDirection:'row', gap: 10}}>
                            <TouchableOpacity
                                onPress={async () => {
                                    const currentTask = tasks.find((task) => task.id === currentTaskId)

                                    if (currentTask) {
                                        await onCheckPressed(currentTask);
                                    }

                                    setShowModal(false);
                                }}
                                style={styles.closebtn}
                            >
                                <Text style={{fontWeight: '600', fontSize: 13}}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>setShowModal(false)}
                                style={styles.closebtn}
                            >
                                <Text style={{fontWeight: '600', fontSize: 13}}>No, close</Text>
                            </TouchableOpacity>
                        </View>
                        
                    </View>
                </Modal>
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
        //paddingTop: 10
    },
    navBTN: {
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        paddingHorizontal: 15
    },
    activeNavBTN: {
        backgroundColor: '#8CDCF9'
    },
    focusTask: {
        fontWeight: '500',
        fontSize: 30,
        textAlign: 'center'
    },
    modalContainer: {
        top: 300,
        alignItems: 'center',
        alignSelf: 'center',
        width: 300,
        height: 190,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10
    },
    closebtn: {
        alignSelf: 'center',
        borderWidth: 1,
        padding: 6,
        borderRadius: 10,
        backgroundColor: '#A6F511',
        paddingHorizontal: 15
    }
});