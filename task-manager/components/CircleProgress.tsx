import { supabase } from "@/config/initSupabase";
import { Task } from "@/types/types";
import { useTaskList } from "@/provider/TaskListProvider";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AnimatedCircularProgress } from "react-native-circular-progress";


export default function CircleProgress() {
    const { tasks } = useTaskList();

    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

    useEffect(() => {
        getCompleted();
    }, [tasks]);

    const getCompleted = async () => {
        const {data: completedTasks, error} = await supabase
            .from('tasks')
            .select('*')
            .eq('isCompleted', true)
        if (error)
            console.log(error.message)
        else
            setCompletedTasks(completedTasks!);
    }

    return (
        <View style={styles.container}>
            <View>
                <AnimatedCircularProgress
                    size={100}
                    width={13}
                    fill={tasks.length === 0 ? 0 : (completedTasks.length / tasks.length) * 100}
                    tintColor="#A6F511"
                    backgroundColor="#FFFFFF"
                    lineCap="round"
                    rotation={0}
                >
                    {
                        (fill) => (
                        <Text style={{fontWeight: '800', fontSize: 20}}>
                            {Math.round(fill)}%
                        </Text>
                        )
                    }
                </AnimatedCircularProgress>
            </View>
            <View style={{alignItems: 'center', paddingTop: 25}}>
                <Text style={{fontWeight: '600', fontSize: 16, paddingBottom: 5}}>you're doing well, sweetie!</Text>
                <Text> {completedTasks.length}/{tasks.length} tasks completed</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderWidth: 1,
        borderRadius: 20,
        padding:20,
        gap: 10
    }
})