import { View, Text, StyleSheet } from 'react-native';

import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput, TouchableOpacity } from '@gorhom/bottom-sheet';
import { forwardRef, useRef, useMemo, useCallback, useImperativeHandle, useState, useEffect, useContext } from 'react';
import { TextInput } from 'react-native-gesture-handler';

import { useTaskList, Task } from '@/provider/TaskListProvider';
import { useAuth } from '@/provider/AuthProvider';

export type Ref = BottomSheet;

export type NewTask ={
    task_name: string
    task_description: string
}

type AddTask = {
    onAdd: (newTask: {task_name: Task['task_name'], task_description: Task['task_description']}) => void;
}

const AddTaskBottomSheet = forwardRef<Ref, AddTask>(({onAdd}: AddTask, ref) => {
    const innerRef = useRef<Ref>(null);

    useImperativeHandle<Ref|null, Ref|null>(
        ref,
        () => innerRef.current
    );

    const snapPoints = useMemo(() => ['70%', '80%'], []);

    const renderBackdrop = useCallback(
        (props:any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []
    );

    const { user } = useAuth();

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const { addTask } = useTaskList();

    const addNewTask = () => {
        onAdd({
            task_name: newTaskTitle,
            task_description: newTaskDesc
        });
        console.log('addnewtask ', newTaskTitle);
        addTask(
            newTaskTitle, 
            newTaskDesc
        );
    };


    return (
        <BottomSheet
            ref={innerRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{backgroundColor: '#302F33'}}
            backgroundStyle={{backgroundColor: 'lightgray'}}
        >
            <View style={{flex:1}}>
                <BottomSheetTextInput 
                    style={[styles.input, styles.title]}
                    placeholder='add a task'
                    onChangeText={(text) => setNewTaskTitle(text)}
                    value={newTaskTitle}
                />
                <BottomSheetTextInput
                    style={[styles.input, styles.desc]}
                    placeholder='add description'
                    onChangeText={setNewTaskDesc}
                    value={newTaskDesc}
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        addNewTask();
                        setNewTaskTitle('');
                        setNewTaskDesc('');
                        innerRef.current?.close();
                    }}

                >
                    <Text style={{padding: 10, paddingHorizontal: 25, color: 'white'}}>Add Task</Text>
                </TouchableOpacity>
            </View> 
            
        </BottomSheet>
    )
})

const styles = StyleSheet.create({
    input: {
        paddingLeft: 20,
        backgroundColor: 'dimgray'
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
    addButton: {
        alignSelf: 'center',
        backgroundColor: '#3141D6',
        borderRadius: 20
    },
});

export default AddTaskBottomSheet;
       