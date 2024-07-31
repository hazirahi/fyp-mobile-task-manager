import { supabase } from '@/config/initSupabase';
import { TaskCat, useTaskList } from '@/provider/TaskListProvider';
import { useAuth } from '@/provider/AuthProvider';


import { View, Alert, StyleSheet, SafeAreaView, Text, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { useEffect, useState, useRef } from 'react';
import 'react-native-url-polyfill/auto';

import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ModuleList from '@/components/ModuleList';
import CircleProgress from '@/components/CircleProgress';
import { router } from 'expo-router';

import TaskListItem from '@/components/TaskListItem';
// import AddTaskBottomSheet, { AddTask } from "@/components/AddTaskBottomSheet";

export default function Home (){
    const { user } = useAuth();

    const [taskList, setTaskList] = useState<TaskCat[]>([]);
    const { tasks, getModule, getCategory, getTasks, onCheckPressed, onDelete, onTaskPressed } = useTaskList();

    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');

    let taskIdCounter = 0;

    const generateTaskId = () => {
        return ++taskIdCounter;
    }

    useEffect(() => {
        if (!user) return;

        getProfile();
        getModule();
        getCategory();
        getTasks();
    }, [user]);


    // get user's name
    async function getProfile(){
        try{
            setLoading(true)
            if (!user) throw new Error('no user on session');

            const { data, error, status } = await supabase
                .from('users')
                .select(`name`)
                .eq('id', user.id)
                .single()
            if (error && status !== 406){
                throw error
            }
            if (data){
                setName(data.name)
            }
        } catch (error){
            if (error instanceof Error){
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient 
                colors={['#0084FF','#16B4F8', '#8CDCF9', '#FFFFFF']}
                style={styles.background}
            />
            <FlatList
                style={{paddingHorizontal: 20}}
                scrollEnabled={true}
                data={tasks}
                keyExtractor={(item) => `${item.id}`}
                contentContainerStyle={{gap:15}}
                ListHeaderComponent={
                    <View>
                        <View>
                            <Text style={styles.greeting}>Hello, {name}</Text>
                            <CircleProgress/>
                            <ModuleList/> 
                        </View>
                        <View style={{flexDirection: 'row', paddingTop: 20, justifyContent: 'space-between'}}>
                            <Text style={styles.header}>Today's tasks</Text>
                            <TouchableOpacity style={styles.addTaskBTN} onPress={()=> router.navigate('addTask')}>
                                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                                    <Ionicons name="add" size={20} color="black" />
                                    <Text style={{fontWeight: '600', fontSize: 13}}>Add Task</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
                renderItem={({ item: task }) => (
                    <TaskListItem 
                        task={task}
                        onCheckPressed={() => onCheckPressed(task)}
                        onDelete={() => onDelete(task)}
                        onTaskPressed={() => onTaskPressed(task)}
                    />
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'white',
        paddingHorizontal: 20
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 730
    },
    greeting: {
        fontFamily: 'EBGaramond',
        fontSize: 50,
        fontWeight: '600',
        paddingBottom: 10
    },
    header: {
        fontWeight: '600',
        fontSize: 30
    },
    addTaskBTN: {
        alignSelf: 'center',
        borderWidth: 1,
        padding: 6,
        borderRadius: 10,
        backgroundColor: '#A6F511'
    },
    bottomContainer: {
        // height: '60%'
        paddingHorizontal: 20
    },
    tasklistContainer: {
        // backgroundColor: 'gray',
        justifyContent: 'center',
        paddingTop: 10,
        
    },
});