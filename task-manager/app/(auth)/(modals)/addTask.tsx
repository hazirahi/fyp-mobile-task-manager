import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, TextInput, Keyboard } from "react-native";
import { Dropdown } from 'react-native-element-dropdown';

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { TaskCat, useTaskList } from "@/provider/TaskListProvider";
import { useAuth } from "@/provider/AuthProvider";

export default function addTaskScreen () {
    const { modules, categories, addTask } = useTaskList();
    const { user } = useAuth();

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    
    const [taskModule, setTaskModule] = useState<number>(0);
    const [taskCategory, setTaskCategory] = useState<number>(0);
    
    const [taskList, setTaskList] = useState<TaskCat[]>([]);

    useEffect(() => {

    }, [taskList]);

    const addNewTask = () => {
        addTask(
            newTaskTitle, newTaskDesc, taskModule, taskCategory
        )

        setNewTaskTitle('');
        setNewTaskDesc('');
        setTaskModule(0);
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#0084FF','#16B4F8', '#8CDCF9', '#FFFFFF', '#8CDCF9', '#16B4F8', '#0084FF']}
                style={styles.background}
            />
            <View style={{paddingHorizontal: 15}}>
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
                />
                <TextInput
                    style={[styles.input, styles.desc]}
                    placeholder="add description"
                    onChangeText={(text) => setNewTaskDesc(text)}
                    value={newTaskDesc}
                    multiline={true}
                />
            </View>
            <View style={{paddingHorizontal: 20, flexDirection:'row', gap: 10}}>
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
            <View style={{padding: 20}}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        addNewTask();
                        Keyboard.dismiss();
                    }}
                >
                    <Text style={{padding: 10, paddingHorizontal: 25, color: 'white'}}>Add Task</Text>
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
        backgroundColor: '#8CDCF9',
        padding: 10,
        borderRadius: 20,
        width: '40%',
        paddingLeft: 15,
        borderWidth: 1,
        borderColor: '#0084FF'
    },
    addButton: {
        alignSelf: 'center',
        backgroundColor: '#0084FF',
        borderRadius: 20,
        // borderWidth: 1,
        // borderColor: 'black'
    },
})