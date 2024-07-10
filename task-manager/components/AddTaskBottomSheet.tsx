import { View, Text, StyleSheet } from 'react-native';

import BottomSheet, { BottomSheetBackdrop, TouchableOpacity } from '@gorhom/bottom-sheet';
import { forwardRef, useRef, useMemo, useCallback, useImperativeHandle, useState, useEffect, useContext } from 'react';
import { TextInput } from 'react-native-gesture-handler';

import { useTaskList, Task } from '@/provider/TaskListProvider';

export type Ref = BottomSheet;

type AddTask = {
    onAdd: (newTask: Task) => void;
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

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    const { addTask } = useTaskList();

    const addNewTask = () => {
        onAdd({
            task_name: newTaskTitle,
            task_description: newTaskDesc
        });
        // task = {
        //     task_name: newTaskTitle,
        //     task_description: newTaskDesc
        // }
        // if(!task) {
        //     return;
        // }
        console.log('addnewtask ', newTaskTitle);
        addTask({task_name: newTaskTitle, task_description: newTaskDesc});
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
                <TextInput 
                    style={styles.input}
                    placeholder='add a task'
                    onChangeText={(text) => setNewTaskTitle(text)}
                    value={newTaskTitle}
                />
                <TextInput
                    style={{fontSize: 20}}
                    placeholder='add description'
                    onChangeText={setNewTaskDesc}
                    value={newTaskDesc}
                />
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        addNewTask();
                        // addTask(
                        //     onAdd({
                        //         task_name: newTaskTitle,
                        //         task_description: newTaskDesc
                        //     });
                        // );
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
        padding: 20,
        lineHeight:40,
        fontSize: 30,
        fontWeight: '600',
        color: 'dimgray'
	},
    addButton: {
        alignSelf: 'center',
        backgroundColor: '#3141D6',
        borderRadius: 20
    },
});

export default AddTaskBottomSheet;
       