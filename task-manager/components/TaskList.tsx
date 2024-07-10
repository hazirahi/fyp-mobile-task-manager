import { supabase } from '@/config/initSupabase';
import { useAuth } from '@/provider/AuthProvider';

import { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import 'react-native-url-polyfill/auto';

import { Button } from 'react-native';

import TaskListItem from './TaskListItem';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useTaskList } from '@/provider/TaskListProvider';

export default function TaskList() {
    const { user } = useAuth();
    const { tasks, getTasks, onCheckPressed, onDelete } = useTaskList();

    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');

    useEffect(() => {
        if (!user) return;

        getProfile();
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
            <Text style={styles.header}>Hello, {name}</Text>
            <View style={styles.bottomContainer}>
                <Text style={styles.header}>Today's tasks</Text>
                <View style={styles.tasklistContainer}>
                    <FlatList
                        style={styles.tasklist}
                        scrollEnabled={true}
                        data={tasks}
                        keyExtractor={(item) => `${item.id}`}
                        contentContainerStyle={{gap:15}}
                        renderItem={({ item: task }) => (
                            <TaskListItem 
                                task={task}
                                onCheckPressed={() => onCheckPressed(task)}
                                onDelete={() => onDelete(task)}
                            />
                        )}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
    },
    header: {
        fontWeight: 'bold',
        fontSize: 30,
        paddingTop: 20,
        paddingBottom: 5
    },
    bottomContainer: {
        
    },
    tasklistContainer: {
        // backgroundColor: 'gray',
        justifyContent: 'center',
        paddingTop: 10
    },
    tasklist: {
        padding: 20,
        paddingVertical: 30,
        borderRadius: 20,
        backgroundColor: 'lightgray'
    },
})