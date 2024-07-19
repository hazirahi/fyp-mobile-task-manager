import { supabase } from '@/config/initSupabase';
import { useAuth } from '@/provider/AuthProvider';

import TaskList from "@/components/TaskList";
import { View, Alert, StyleSheet } from "react-native";
import { useEffect, useState, useRef } from 'react';

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import 'react-native-url-polyfill/auto';
import { Ionicons } from '@expo/vector-icons';

import AddTaskBottomSheet from "@/components/AddTaskBottomSheet";
import { Task, useTaskList } from '@/provider/TaskListProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import TaskListItem from '@/components/TaskListItem';

const categories = [
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

    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleOpenPress = () => bottomSheetRef.current?.expand();

    const [taskList, setTaskList] = useState<Array<Task>>([]);
    const { getModule, getCategory, getTasks } = useTaskList();

    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');

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