import { supabase } from '@/config/initSupabase';
import { Session } from '@supabase/supabase-js';
import { useAuth } from '@/provider/AuthProvider';

import TaskList from "@/components/TaskList";
import { View, Text, Alert, StyleSheet } from "react-native";
import { useEffect, useState, useRef, useMemo } from 'react';

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import 'react-native-url-polyfill/auto';
import { Ionicons } from '@expo/vector-icons';

import AddTaskBottomSheet from "@/components/AddTaskBottomSheet";
import { Task, useTaskList } from '@/provider/TaskListProvider';

export default function Home (){
    const { user } = useAuth();
    const [session, setSession] = useState<Session | null>(null);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleOpenPress = () => bottomSheetRef.current?.expand();

    const [taskList, setTaskList] = useState<Array<Task>>([]);
    const { tasks } = useTaskList();

    return (
        <View style={styles.container}>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingHorizontal: 20
    },
    addTaskBTN: {
        position: 'absolute',
        bottom: 10,
        right: 2
    }
});