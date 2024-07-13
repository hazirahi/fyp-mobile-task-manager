import { View, Text, StyleSheet } from 'react-native';
import { forwardRef, useRef, useMemo, useCallback, useImperativeHandle, useState, useEffect } from 'react';

import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput, TouchableOpacity } from '@gorhom/bottom-sheet';
import { Dropdown } from 'react-native-element-dropdown';

import { useTaskList, Task, Module } from '@/provider/TaskListProvider';

export type Ref = BottomSheet;

type AddTask = {
    onAdd: (
        newTask: {
            task_name: Task['task_name'],
            task_description: Task['task_description'],
            module_id: Task['module_id']
        }
    ) => void;
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

    const { addTask } = useTaskList();
    const { modules } = useTaskList();

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    
    const [taskModule, setTaskModule] = useState<number | null>(null);

    const addNewTask = () => {
        onAdd({
            task_name: newTaskTitle,
            task_description: newTaskDesc,
            module_id: taskModule
        });
        console.log('addnewtask ', taskModule);
        addTask(
            newTaskTitle, 
            newTaskDesc,
            taskModule
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
            keyboardBehavior='fillParent'
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
                <View style={{paddingHorizontal: 20}}>
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
                </View>
            </View> 
            
            <View style={{padding: 20}}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        addNewTask();
                        setNewTaskTitle('');
                        setNewTaskDesc('');
                        setTaskModule(null);
                        innerRef.current?.close();
                    }}

                >
                    <Text style={{padding: 10, paddingHorizontal: 25, color: 'white'}}>Add Task</Text>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
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
    dropdown: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 20,
        width: '40%',
        paddingLeft: 15
    },
    addButton: {
        alignSelf: 'center',
        backgroundColor: '#3141D6',
        borderRadius: 20
    },
});

export default AddTaskBottomSheet;
       