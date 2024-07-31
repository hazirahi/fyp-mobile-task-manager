import { useEffect, useState, useRef } from "react";
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Keyboard } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { TaskCat, useTaskList } from "@/provider/TaskListProvider";
import { useAuth } from "@/provider/AuthProvider";
import AddDateTimePicker from "@/components/AddDateTimePicker";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import dayjs from "dayjs";

export default function addTaskScreen () {
    const { modules, categories, addTask } = useTaskList();
    const { user } = useAuth();

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    
    const [taskModule, setTaskModule] = useState<number>(0);
    const [taskCategory, setTaskCategory] = useState<number>(0);

    const [date, setDate] = useState(new Date());
    const [dueDate, setDueDate] = useState('Due Date');

    const handleDueDateChange = (date: Date) => {
        setDueDate(dayjs(date).format('DD-MM-YYYY'));
        setDate(date);
    }
    
    const [taskList, setTaskList] = useState<TaskCat[]>([]);

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const handleOpenPress = () => bottomSheetRef.current?.present();

    useEffect(() => {

    }, [taskList]);

    const addNewTask = () => {
        addTask(
            newTaskTitle, newTaskDesc, taskModule, taskCategory, date
        )

        setNewTaskTitle('');
        setNewTaskDesc('');
        setTaskModule(0);
        setDate(new Date());
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#A6F511','#D5FF61', '#F6FF78', '#FFFFFF', '#F6FF78', '#D5FF61', '#A6F511']}
                style={styles.background}
            />
            <View style={{paddingLeft: 15, width: 40}}>
                <TouchableOpacity onPress={() => router.navigate('home')}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View>
                <TextInput
                    style={[styles.input, styles.title]}
                    placeholder="add a task"
                    onChangeText={(text) => setNewTaskTitle(text)}
                    value={newTaskTitle}
                    multiline={true}
                    onEndEditing={() => Keyboard.dismiss()}
                />
                <TextInput
                    style={[styles.input, styles.desc]}
                    placeholder="add description"
                    onChangeText={(text) => setNewTaskDesc(text)}
                    value={newTaskDesc}
                    multiline={true}
                    onEndEditing={() => Keyboard.dismiss()}
                />
            </View>
            <View style={{paddingHorizontal: 20, flexDirection:'row', gap: 10, paddingTop:60}}>
                <Dropdown
                    style={styles.dropdown}
                    data={modules}
                    labelField='module_title'
                    valueField='id'
                    placeholder='Module'
                    onChange={item => {
                        setTaskModule(item.id);
                    }}
                />
                <Dropdown
                    style={styles.dropdown}
                    data={categories}
                    labelField='category_name'
                    valueField='id'
                    placeholder='Category'
                    onChange={item => {
                        setTaskCategory(item.id);
                    }}
                />
                
                
            </View>
            <View style={{paddingHorizontal: 20, paddingTop: 10}}>
                <TouchableOpacity
                    style={[styles.dropdown, {width: '36%'}]}
                    onPress={handleOpenPress}
                >
                    <Text style={{textAlign: 'center', fontSize: 15}}>{dueDate}</Text>
                </TouchableOpacity>
                <AddDateTimePicker
                    ref={bottomSheetRef}
                    onAdd={(startDate) => {
                        handleDueDateChange(startDate);
                        bottomSheetRef.current?.close();
                    }}
                />
            </View>
            <View style={{padding: 20, position: 'absolute', bottom: 20}}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        addNewTask();
                        Keyboard.dismiss();
                        router.navigate('home');
                    }}
                >
                    <Text style={{padding: 10, paddingHorizontal: 25, textAlign: 'center', fontWeight: '600', fontSize: 16}}>Add Task</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#0084FF'
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 900
    },
    input: {
        paddingLeft: 20
	},
    title: {
        paddingTop: 25,
        fontSize: 35,
        fontWeight: '600',
        color: 'black'
    },
    desc: {
        fontSize: 18,
        paddingBottom: 20
    },
    dropdown: {
        backgroundColor: '#F6FF78',
        padding: 10,
        borderRadius: 20,
        width: '40%',
        paddingLeft: 15,
        borderWidth: 1
    },
    addButton: {
        alignSelf: 'center',
        backgroundColor: '#A6F511',
        borderRadius: 20,
        width: 348,
        borderWidth: 1
    },
})