import { supabase } from '@/config/initSupabase';
import { useAuth } from '@/provider/AuthProvider';
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';

import { FlatList } from 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';

type Task = {
    id: number
    user_id: string
    task_name: string
    task_description: string
    isCompleted: boolean
    created_at: Date
}

export default function TaskList() {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);

    const [name, setName] = useState('');

    const [taskList, setTaskList] = useState<Array<Task>>([]);
    const [task, setTask] = useState('');

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
        });
    }, []);

    useEffect(() => {
        if (session) getProfile();
    }, [session]);

    useEffect(() => {
        getTasks();
    },[]);

    async function getProfile(){
        try{
            setLoading(true)
            if (!session?.user) throw new Error('no user on session');

            const { data, error, status } = await supabase
                .from('users')
                .select(`name`)
                .eq('id', session?.user.id)
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

    const getTasks = async () => {
        // const { data: taskList } = await supabase
        //     .from<Task>('tasks')
        //     .select('*')
        //     .order('id', {ascending:false})
        // setTaskList(taskList!)

        let {data} = await supabase
            .from('tasks')
            .select ('*')
            .order('created_at', {ascending:false})
        setTaskList(data || []);
    }

    return (
        <View>
            <Text style={styles.header}>Hello, {name}</Text>
            <View style={styles.tasklistContainer}>
                <FlatList
                    scrollEnabled={true}
                    data={taskList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={({ item: task }) => (
                        <Text>{task.task_name}</Text>
                    )}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        fontWeight: 'bold',
        fontSize: 30,
        paddingTop: 20,
        paddingBottom: 5
    },
    tasklistContainer: {
        backgroundColor: 'gray',
        borderRadius: 20,
        padding: 20
    }
})