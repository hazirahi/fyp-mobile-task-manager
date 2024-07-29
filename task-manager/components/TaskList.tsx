import { supabase } from '@/config/initSupabase';
import { useAuth } from '@/provider/AuthProvider';

import { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';

import TaskListItem from './TaskListItem';
import { useTaskList } from '@/provider/TaskListProvider';
import ModuleList from './ModuleList';
import CircleProgress from './CircleProgress';
import { router } from 'expo-router';


export default function TaskList() {
    const { user } = useAuth();
    const { tasks, getModule, getCategory, getTasks, onCheckPressed, onDelete, onTaskPressed } = useTaskList();

    const [loading, setLoading] = useState(true);
    
    const [name, setName] = useState('');

    const date = new Date().toDateString();

    useEffect(() => {
        if (!user) return;

        getProfile();
        getModule();
        // getCategory();
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
                // console.log(name)
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
        <View>
            <View style={styles.bottomContainer}>
                <View style={styles.tasklistContainer}>
                    <FlatList
                        style={styles.tasklist}
                        scrollEnabled={true}
                        data={tasks}
                        keyExtractor={(item) => `${item.id}`}
                        contentContainerStyle={{gap:15}}
                        ListHeaderComponent={
                            <View>
                                <Text style={styles.greeting}>Hello, {name}</Text>
                                <CircleProgress/>
                                {/* <Text style={{fontSize: 15, fontWeight: '600'}}>{date}</Text> */}
                                <ModuleList/>
                                <View style={{flexDirection: 'row', paddingTop: 20, justifyContent: 'space-between'}}>
                                    <Text style={styles.header}>Today's tasks</Text>
                                    <TouchableOpacity style={styles.addTaskBTN} onPress={()=> router.navigate('addTask')}>
                                        <Text>Add Task</Text>
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
                </View>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
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
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#A6F511'
    },
    bottomContainer: {
        // height: '60%'
    },
    tasklistContainer: {
        // backgroundColor: 'gray',
        justifyContent: 'center',
        paddingTop: 10,
        
    },
    tasklist: {
        // padding: 20,
        // paddingVertical: 30,
        // borderRadius: 20,
        // backgroundColor: 'lightgray'
    },
})