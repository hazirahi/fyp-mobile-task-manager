import { View, Text, StyleSheet } from 'react-native';
import { forwardRef, useRef, useMemo, useCallback, useImperativeHandle, useState, useEffect } from 'react';

import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput, TouchableOpacity } from '@gorhom/bottom-sheet';
import { Dropdown } from 'react-native-element-dropdown';

import { useTaskList, TaskCat } from '@/provider/TaskListProvider';

import { useAuth } from '@/provider/AuthProvider';

export type Ref = BottomSheet;

export type AddTask = {
    onAdd: (
        newTask: {
            task_name: TaskCat['task_name'],
            task_description: TaskCat['task_description'],
            module_id: TaskCat['module_id'],
            category_id: TaskCat['category_id']
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

    const { modules, categories, addTask } = useTaskList();
    const { user } = useAuth();

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');
    
    const [taskModule, setTaskModule] = useState<number>(0);
    const [taskCategory, setTaskCategory] = useState<number>(0);
    
    const [taskList, setTaskList] = useState<TaskCat[]>([]);

    useEffect(() => {
        // console.log('tasklist (useeffect): ', taskList);
    }, [taskList]);

    const addNewTask = () => {
        onAdd({
            task_name: newTaskTitle,
            task_description: newTaskDesc,
            module_id: taskModule,
            category_id: taskCategory
        });
        console.log(newTaskTitle, newTaskDesc, taskModule, taskCategory)

        addTask(
            newTaskTitle, newTaskDesc, taskModule, taskCategory
        )

        setNewTaskTitle('');
        setNewTaskDesc('');
        setTaskModule(0);
        innerRef.current?.close();

    }

    // const addTask = async (
    //     task_name: TaskCat['task_name'],
    //     task_description: TaskCat['task_description'],
    //     moduleId: TaskCat['module_id'],
    //     categoryId: TaskCat['category_id']
    // ) => {
    //     try {
    //         const { data: tasklist, error } = await supabase
    //             .from('tasks')
    //             .insert({ 
    //                 task_name: task_name,
    //                 task_description: task_description,
    //                 user_id: user!.id,
    //                 module_id: moduleId,
    //             })
    //             .select('*')
    //             .single()
    //         if(error)
    //             console.log(error.message)
    //         else {
    //             console.log('tasklist: ', tasklist);
    //             const taskId = tasklist.id;
    //             console.log('catid: ', categoryId, moduleId, taskId);
    //             const { data: taskcat, error: taskcatError } = await supabase
    //                 .from('module_categories')
    //                 .insert({
    //                     category_id: categoryId,
    //                     module_id: moduleId,
    //                     task_id: taskId,
    //                     user_id: user!.id
    //                 })
    //                 .select('*')
    //                 .single()
    //             if(taskcatError)
    //                 console.log(taskcatError.message)
    //             else{
    //                 console.log('taskcat: ', taskcat);
    //                 setTaskList([taskcat, ...taskList]);
    //             }
            
    //         }
    //     } catch (error: any) {
    //         console.log(error.message)
    //     }
    // }

    // const addNewTask = () => {
    //     onAdd({
    //         task_name: newTaskTitle,
    //         task_description: newTaskDesc,
    //         module_id: taskModule,
    //         category_id: taskCategory
    //     });
    //     console.log('addnewtask ', taskCategory);
    //     addTask(
    //         newTaskTitle, 
    //         newTaskDesc,
    //         taskModule,
    //         taskCategory
    //     );
        // const addTask = async (id: number, task_name: string, task_description: string, moduleId: number, categoryId: number) => {
        //     // const task = {id, task_name, task_description, moduleId};
        //     // const taskCategory = { taskId: task.id, categoryId};

        //     const {}


        // }

    //};

    return (
        <BottomSheet
            ref={innerRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{backgroundColor: '#302F33'}}
            backgroundStyle={{backgroundColor: 'white'}}
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
            </View> 
            <View style={{padding: 20}}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        addNewTask();
                        
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
});

export default AddTaskBottomSheet;
       