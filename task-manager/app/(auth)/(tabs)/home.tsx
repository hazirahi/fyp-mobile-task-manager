import { supabase } from '@/config/initSupabase';
import { TaskCat, useTaskList } from '@/provider/TaskListProvider';
import { useAuth } from '@/provider/AuthProvider';


import { View, Alert, StyleSheet, SafeAreaView } from "react-native";
import { useEffect, useState, useRef } from 'react';
import 'react-native-url-polyfill/auto';

import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import TaskList from "@/components/TaskList";
import AddTaskBottomSheet, { AddTask } from "@/components/AddTaskBottomSheet";




// const categories = [
//     {
//         type: 'overview',
//         title: 'Hello'
//     },
//     {
//         type: 'dailyTasks',
//         title: 'dailytasks',
//         data: TaskListItem
//     }
// ]

export default function Home (){
    const { user } = useAuth();

    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleOpenPress = () => bottomSheetRef.current?.expand();

    const [taskList, setTaskList] = useState<TaskCat[]>([]);
    const { getModule, getCategory, getTasks } = useTaskList();

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
            <View style={{paddingHorizontal: 20}}>
                <TaskList/>
            </View>
            <Ionicons name='add-circle' size={80} color='#00CC44' onPress={handleOpenPress} style={styles.addTaskBTN}/>
            <AddTaskBottomSheet
                ref={bottomSheetRef}
                onAdd={(newTask) => 
                    // setTaskList(tasks => [...tasks, newTask])
                    setTaskList(tasks => [...tasks, {
                        id: generateTaskId(),
                        user_id: user!.id,
                        task_name: newTask.task_name,
                        task_description: newTask.task_description,
                        isCompleted: false,
                        created_at: new Date(),
                        module_id: newTask.module_id,
                        category_id: newTask.category_id
                    }])
                }
            />
        </SafeAreaView>
    );
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