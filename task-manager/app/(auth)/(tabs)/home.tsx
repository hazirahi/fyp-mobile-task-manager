import { supabase } from '@/config/initSupabase';
import { Session } from '@supabase/supabase-js';
import { useAuth } from '@/provider/AuthProvider';

import TaskList from "@/components/TaskList";
import { View, Text, Alert, StyleSheet, SectionList } from "react-native";
import { useEffect, useState, useRef, useMemo } from 'react';

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import 'react-native-url-polyfill/auto';
import { Ionicons } from '@expo/vector-icons';

import AddTaskBottomSheet from "@/components/AddTaskBottomSheet";
import { Task, useTaskList } from '@/provider/TaskListProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskListItem from '@/components/TaskListItem';
import { ScrollView } from 'react-native-gesture-handler';
import ModuleList from '@/components/ModuleList';

const sections = [
    {
        type: 'overview',
        title: 'Hello'
    },
    {
        type: 'dailyTasks',
        title: 'dailytasks',
        data: TaskListItem
    }
]

export default function Home (){
    const { user } = useAuth();
    const [session, setSession] = useState<Session | null>(null);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleOpenPress = () => bottomSheetRef.current?.expand();

    const [taskList, setTaskList] = useState<Array<Task>>([]);
    const { tasks, getModule, getTasks, onCheckPressed, onDelete } = useTaskList();

    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');

    useEffect(() => {
        if (!user) return;

        getProfile();
        getModule();
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
            <View>
                <TaskList/>
            </View>
            <Ionicons name='add-circle' size={80} color='#7BBF45' onPress={handleOpenPress} style={styles.addTaskBTN}/>
            <AddTaskBottomSheet
                ref={bottomSheetRef}
                onAdd={(newTask: Task) => 
                    setTaskList(tasks => [...tasks, newTask])
                }
            />
        </SafeAreaView>
        // <SafeAreaView style={styles.container}>
        //     <ScrollView>
        //         <View>
        //             <Text style={styles.header}>Hello, {name}</Text>
        //             <ModuleList/>
        //         </View>
        //         <View>
        //             <Text style={styles.header}>Today's tasks</Text>
        //             <TaskList/>
        //         </View>
        //     </ScrollView>
        // </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingHorizontal: 20
    },
    header: {
        fontWeight: 'bold',
        fontSize: 30,
        paddingTop: 20,
        paddingBottom: 20
    },
    addTaskBTN: {
        position: 'absolute',
        bottom: 10,
        right: 2
    }
});