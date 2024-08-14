import { useEffect, useState, useRef } from "react";
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Keyboard, ScrollView } from "react-native";
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Task } from "@/types/types";
import { useTaskList } from "@/provider/TaskListProvider";
import { useAuth } from "@/provider/AuthProvider";
import AddDateTimePicker from "@/components/AddDateTimePicker";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import dayjs from "dayjs";


export default function addTaskScreen () {
    const { modules, categories, priorities, addTask } = useTaskList();
    const { user } = useAuth();

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    
    const [taskModule, setTaskModule] = useState<number>(0);
    const [taskCategory, setTaskCategory] = useState<number>(0);
    const [taskPriority, setTaskPriority] = useState<number>(0);

    const [date, setDate] = useState<Date | null>(new Date());
    const [dueDate, setDueDate] = useState('Due Date');

    const handleDueDateChange = (date: Date | null) => {
        if(date) {
            setDueDate(dayjs(date).format('DD-MM-YYYY'));
            setDate(date);
        } else {
            setDueDate('Due Date');
            setDate(null);
        }
    }
    
    const [taskList, setTaskList] = useState<Task[]>([]);

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const handleOpenPress = () => bottomSheetRef.current?.present();

    useEffect(() => {
        // console.log('addTask priorities: ', priorities)
    }, [taskList]);

    const addNewTask = () => {
        addTask(
            newTaskTitle,
            newTaskDesc,
            taskModule || null,
            taskCategory || null,
            date || null,
            taskPriority || null
        )

        setNewTaskTitle('');
        setNewTaskDesc('');
        setTaskModule(0);
        setTaskCategory(0);
        setDate(new Date());
        setTaskPriority(0);
    }

    const [selectedPriority, setSelectedPriority] = useState(null);
  
    const handlePress = (priority: any) => {
        setSelectedPriority(priority);
        setTaskPriority(priority.id);
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#A6F511','#D5FF61', '#F6FF78', '#FFFFFF', '#F6FF78', '#D5FF61', '#A6F511']}
                style={styles.background}
            />
            <View style={{paddingLeft: 15, width: 40}}>
                <TouchableOpacity onPress={() => router.navigate('/home')}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            {/* <View>
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
            <View style={{paddingHorizontal: 20, paddingTop: 10, flexDirection: 'row'}}>
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
                <Dropdown
                    style={styles.dropdown}
                    data={priorities}
                    labelField={'priority'}
                    valueField={'id'}
                    placeholder="Priority"
                    onChange={item=> {
                        setTaskPriority(item.id);
                    }}
                />
            </View> */}
            <ScrollView style={{paddingHorizontal: 20}} keyboardShouldPersistTaps='handled'>
            <View style={{paddingTop: 10}}>
                <View style={{paddingVertical: 10}}>
                    <Text style={{fontWeight: '600', fontSize: 20, paddingBottom: 5}}>Task:</Text>
                    <TextInput
                        style={{padding: 15, backgroundColor: 'white', borderWidth: 1, borderRadius: 15}}
                        placeholder="Add Task"
                        onChangeText={(text) => setNewTaskTitle(text)}
                        onEndEditing={() => Keyboard.dismiss()}
                    />
                    
                </View>
                <Text style={{fontWeight: '600', fontSize: 20, paddingBottom: 10}}>Optional:</Text>
                <View style={{paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, borderWidth: 1}}>
                <View style={{paddingVertical: 10}}>
                    <Text style={{fontWeight: '500', fontSize: 17, paddingBottom: 5}}>Description:</Text>
                    <TextInput
                            style={{padding: 15, backgroundColor: 'white', borderWidth: 1, borderRadius: 15, height: 90}}
                            placeholder="Add Description"
                            multiline
                            onChangeText={(text) => setNewTaskDesc(text)}
                            onEndEditing={() => Keyboard.dismiss()}
                    />
                </View>
                <View style={{paddingVertical: 10}}>
                    <Text style={{fontWeight: '500', fontSize: 17, paddingBottom: 5}}>Priority:</Text>
                    <View style={styles.priorityContainer}>
                        {priorities.map((priority, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.priorityButton,
                                    selectedPriority === priority && styles.selectedPriorityButton,
                                ]}
                                onPress={() => {
                                    handlePress(priority);
                                }}
                            >
                                <Text style={styles.priorityText}>{priority.priority}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
                <View style={{flexDirection:'row', justifyContent: 'space-between', paddingVertical: 10}}>
                    <View style={{width: '50%'}}>
                        <Text style={{fontWeight: '500', fontSize: 17, paddingBottom: 5}}>Module:</Text>
                        <Dropdown
                            style={[styles.dropdown]}
                            data={modules}
                            labelField='module_title'
                            valueField='id'
                            placeholder='Module'
                            onChange={item => {
                                setTaskModule(item.id);
                            }}
                        />
                    </View>
                    <View style={{width: '40%'}}>
                        <Text style={{fontWeight: '500', fontSize: 17, paddingBottom: 5}}>Due Date:</Text>
                        <TouchableOpacity
                            style={[styles.dropdown]}
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
                </View>
                <View style={{paddingVertical: 10}}>
                    <Text style={{fontWeight: '500', fontSize: 17, paddingBottom: 5}}>Category: </Text>
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
                    {/* <MultiSelect
                        data={categories}
                        labelField='category_name'
                        valueField='id'
                        placeholder='Category'
                        onChange={item => {
                            setTaskCategory(item.id);
                        }}
                    /> */}
                </View>
            </View>
            </View>
            </ScrollView>
            <View style={{padding: 20, position: 'absolute', bottom: 20}}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        addNewTask();
                        Keyboard.dismiss();
                        router.navigate('/home');
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
        padding: 15,
        borderRadius: 30,
        //width: '40%',
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
    priorityContainer: {
        backgroundColor: '#A6F511',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        borderRadius: 25,
        borderWidth: 1
    },
    priorityButton: {
        padding: 10,
        borderRadius: 20,
        width: 100,
    },
    selectedPriorityButton: {
        backgroundColor: 'white',
    },
    priorityText: {
        fontSize: 16,
        color: 'black',
        textAlign: 'center'
    }
})