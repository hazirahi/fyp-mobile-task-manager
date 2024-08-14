import { supabase } from '@/config/initSupabase';
import { useTaskList } from '@/provider/TaskListProvider';
import { useAuth } from '@/provider/AuthProvider';
import { Task } from '@/types/types';

import ModuleList from '@/components/ModuleList';
import CircleProgress from '@/components/CircleProgress';
import TaskListItem from '@/components/TaskListItem';

import { useEffect, useState, useRef } from 'react';
import { View, Alert, StyleSheet, SafeAreaView, Text, TouchableOpacity, ScrollView, FlatList } from "react-native";
import 'react-native-url-polyfill/auto';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { router, useSegments } from 'expo-router';

import BottomSheet from '@gorhom/bottom-sheet';
//import AddTaskBottomSheet, { AddTask } from "@/components/AddTaskBottomSheet";

import { Circle, Svg, Symbol, Use } from "react-native-svg";
import { Text as SvgText } from "react-native-svg";

export default function Home (){
    const { user } = useAuth();

    const [taskList, setTaskList] = useState<Task[]>([]);
    const { tasks, getPriority, getModule, getCategory, getTasks, onCheckPressed, onDelete, onTaskPressed } = useTaskList();

    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');

    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleOpenPress = () => bottomSheetRef.current?.expand();

    let taskIdCounter = 0;

    const generateTaskId = () => {
        return ++taskIdCounter;
    }

    useEffect(() => {
        if (!user) return;

        getProfile();
        getPriority();
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

    const getPrioritySymbol = (task: Task) => {
        switch (task.priority_id) {
            //low
            case 1:
                return (
                    <View style={{position: 'absolute'}}>
                        <Svg height="40" width="45" pointerEvents="none">
                        <Symbol id="symbol" viewBox="0 0 80 90">
                            <Circle cx='0' cy='0' r='40' fill='#FFBB00' />
                            <Circle cx='30' cy='20' r='25' fill='#FFBB00' />
                        </Symbol>
                        <Use href="#symbol" x={0} y={20} width={75} height={38}/>
                        <SvgText
                            x={20}
                            y={21}
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fontWeight={'900'}
                            fontSize={16}
                            fill={'white'}
                        >!</SvgText>
                    </Svg>
                    </View>
                    
                )
            // medium
            case 2:
                return (
                    <View style={{position: 'absolute'}}>
                    <Svg height="40" width="45" pointerEvents="none">
                        <Symbol id="symbol" viewBox="0 0 80 90">
                            <Circle cx='0' cy='0' r='40' fill='#FF8800' />
                            <Circle cx='30' cy='20' r='25' fill='#FF8800' />
                        </Symbol>
                        <Use href="#symbol" x={0} y={20} width={75} height={38}/>
                        <SvgText
                            x={20}
                            y={21}
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fontWeight={'900'}
                            fontSize={16}
                            fill={'white'}
                        >!!</SvgText>
                    </Svg>
                    </View>
                )
            // high
            case 3:
                return (
                    <View style={{position: 'absolute'}}>
                    <Svg height="40" width="45" pointerEvents="none">
                        <Symbol id="symbol" viewBox="0 0 80 90">
                            <Circle cx='0' cy='0' r='40' fill='#E51F1F' />
                            <Circle cx='30' cy='20' r='25' fill='#E51F1F' />
                        </Symbol>
                        <Use href="#symbol" x={0} y={20} width={75} height={38}/>
                        <SvgText
                            x={20}
                            y={21}
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fontWeight={'900'}
                            fontSize={16}
                            fill={'white'}
                        >!!!</SvgText>
                    </Svg>
                    </View>
                )
            default:
                return null;
        }
    }

    const onEditTask = (task: Task) => {
        console.log(task.id);
        router.navigate({pathname: '/editTask', params: {taskId: task.id}});
    }

    // const segments = useSegments();
    // console.log(segments);

    return (
        <>
        <SafeAreaView style={styles.container}>
            <LinearGradient 
                colors={['#0084FF','#16B4F8', '#8CDCF9', '#FFFFFF']}
                style={styles.background}
            />
            <FlatList
                //style={{paddingHorizontal: 20}}
                scrollEnabled={true}
                data={tasks}
                keyExtractor={(item) => `${item.id}`}
                //contentContainerStyle={{gap:10}}
                ListHeaderComponent={
                    <View style={{paddingHorizontal: 20}}>
                        <View>
                            <Text style={styles.greeting}>Hello, {name}</Text>
                            <CircleProgress/>
                            <ModuleList/> 
                        </View>
                        <View style={{flexDirection: 'row', paddingTop: 20, justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={styles.header}>Tasks</Text>
                                {/* <Text>priority</Text> */}
                            </View>
                            <TouchableOpacity style={styles.addTaskBTN} onPress={()=> router.navigate('/(auth)/(modals)/addTask')}>
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
                        onEdit={() => onEditTask(task)}
                        onTaskPressed={() => onTaskPressed(task)}
                        prioritySymbol={getPrioritySymbol(task)}
                    />
                    
                )}
                ListEmptyComponent={
                    <View style={{padding: 20}}>
                        <View style={{ borderWidth: 1, borderRadius: 20, padding: 40, height: '60%'}}>
                            <Text style={{textAlign: 'center', top: '30%', fontSize: 16, fontWeight: '500'}}>
                                You haven't created any tasks yet! Tap the + Add Task button to create a new task.
                            </Text>
                        </View>
                    </View>
                    
                }
            />
        </SafeAreaView>
        {/* <Ionicons name='add-circle' size={80} color='#00CC44' onPress={handleOpenPress} style={styles.addTaskBTN}/>
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
            /> */}
            
        </>
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