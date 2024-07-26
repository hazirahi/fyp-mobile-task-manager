import { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, SectionList, SectionListData, SectionListRenderItem, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";

import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { supabase } from "@/config/initSupabase";
import BottomSheet from "@gorhom/bottom-sheet";

import TaskListItem from "@/components/TaskListItem";
import AddTaskBottomSheet from "@/components/AddTaskBottomSheet";

import { useTaskList, TaskCat, ModuleCat } from "@/provider/TaskListProvider";
import { useAuth } from "@/provider/AuthProvider";

const getCatNames = async (categoryIds: number[]) => {
    const {data: categories, error} = await supabase
        .from('categories')
        .select('id, category_name')
        .in('id', categoryIds)
    if (error)
        throw error
    if (!categories)
        return {};

    return categories.reduce((acc: { [id: number]: string}, category) => {
        acc[category.id] = category.category_name;
        return acc;
    }, {});
}

// const getModuleTasks = async (taskIds: number[]) => {
//     const {data: moduletasks, error} = await supabase
//         .from('tasks')
//         .select('*')
//         .in('id', taskIds);
//     if (error)
//         throw error;
//     if (!moduletasks)
//         return {};

//     return moduletasks.reduce((acc: { [id: number]: string }, task) => {
//         acc[task.id] = task.task_name;
//         return acc;
//     }, {});
// };


const ModuleDetail = () => {
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const { onCheckPressed, onDelete, tasks, onTaskPressed} = useTaskList();
    const { user } = useAuth();

    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleOpenPress = () => bottomSheetRef.current?.expand();
    const [taskList, setTaskList] = useState<TaskCat[]>([]);

    const handleTaskAdded = (newTask: TaskCat) => {
        setTaskList([...taskList, newTask]);
    };

    // const [layoutType, setLayoutType] = useState('vertical');

    // const handleLayoutChange = () => {
    //     setLayoutType(layoutType === 'vertical' ? 'horizontal' : 'vertical');
    // }

    const [ moduleTitle, setModuleTitle ] = useState('');
    const [ moduleDesc, setModuleDesc ] = useState('');
    const [ moduleColour, setModuleColour ] = useState('');

    const [moduleCatList, setModuleCatList] = useState<ModuleCat[]>([]);
    const [catNames, setCatNames] = useState<{[id:number]:string}>({});

    let taskIdCounter = 0;

    const generateTaskId = () => {
        return ++taskIdCounter;
    }
    
    useEffect(() => {
        console.log(id);
        id&&getModuleInfo();
        getModuleCat();
    }, [id]);

    useEffect(() => {
        const categoryIds = Array.from(new Set(moduleCatList.map((moduleCat) => moduleCat.category_id)));
        getCatNames(categoryIds).then((catNames) => setCatNames(catNames));

        const taskIds = Array.from(new Set(moduleCatList.map((moduleCat) => moduleCat.task_id)));
        // getModuleTasks(taskIds).then((taskNames) => setTaskNames(taskNames));
    },[moduleCatList]);

    const getModuleCat = async () => {
        const {data: moduleCatList} = await supabase
            .from('module_categories')
            .select(`*, categories(*), tasks(*)`)
            .eq('module_id', id)
        if (moduleCatList)
            setModuleCatList(moduleCatList!);
    }

    const sections: SectionListData<ModuleCat>[] = Object.entries(catNames).map(([categoryId, catName]) => ({
        title: catName,
        data: moduleCatList.filter((moduleCat) => moduleCat.category_id === parseInt(categoryId, 10)),
    }));


    const renderItem: SectionListRenderItem<ModuleCat> = ({ item }) => {
        const task = tasks.find((t) => t.id === item.task_id);
        if (!task)
            return null;

        const taskwithModuleId: TaskCat = { ...task, module_id: item.module_id};
        return (
            <TaskListItem 
                task={taskwithModuleId} 
                onCheckPressed={() => onCheckPressed(taskwithModuleId)}
                onDelete={() => onDelete(taskwithModuleId)}
                onTaskPressed={()=> onTaskPressed(taskwithModuleId)}
            />
        );
    };


    // const getModuleDetail = async () => {
    //     const { data: modules, error } = await supabase
    //         .from('modules')
    //         .select('*')
    //         .eq('id', id)
    //     if (modules){
            
    //         const { data: categories } = await supabase.from('categories').select('*');
    //         const { data: tasks } = await supabase.from('tasks').select('*').eq('module_id', id);

           
    //         const catGrouped: any = categories?.map((category: any) => {
    //             const items = tasks?.filter((task: Task) => category.id === task.category_id);
    //             return {...category, data: items}
    //         })
    //         setTaskCategoryList(catGrouped);
    //         console.log(taskCategoryList);
    //     }
    // }

    const getModuleInfo = async () => {
        const { data: modules, error } = await supabase
            .from('modules')
            .select('*')
            .eq('id', id)
            .single()
        if (modules) {
            setModuleTitle(modules.module_title);
            setModuleDesc(modules.module_description);
            setModuleColour(modules.colour);
        }
    }

    async function updateModule({
        moduleTitle,
        moduleDesc,
        moduleColour
    } : {
        moduleTitle: string
        moduleDesc: string
        moduleColour: string
    }) {
        try {
            setLoading(true);
            if (!user)
                throw new Error('no user on session')
            const updates = {
                user_id: user.id,
                id: id,
                module_title: moduleTitle,
                module_description: moduleDesc,
                colour: moduleColour
            }
            
            console.log(updates)
            
            const { error } = await supabase
                .from('modules')
                .upsert(updates)
            if (error)
                throw error
        } catch (error) {
            if (error instanceof Error)
                alert(error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <SafeAreaView style={{paddingHorizontal: 20, backgroundColor: 'white', height: '100%'}}>
                <LinearGradient 
                    colors={[moduleColour,'#FFFFFF']}
                    style={styles.background}
                />
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View>
                        <TextInput 
                            placeholder="module title" 
                            value={moduleTitle || ''}
                            onChangeText={(text) => setModuleTitle(text)}
                            style={styles.header}
                            onEndEditing={() => updateModule({moduleTitle, moduleDesc, moduleColour})}
                        />
                        <TextInput 
                            placeholder="module desc"
                            value={moduleDesc || ''} 
                            onChangeText={(text) => setModuleDesc(text)} 
                            style={styles.description} 
                            onEndEditing={() => updateModule({moduleTitle, moduleDesc, moduleColour})} 
                        />
                    </View>
                    <View style={{paddingTop: 10}}>
                        <TouchableOpacity style={[styles.moduleColour, {backgroundColor: moduleColour}]}/>
                    </View>
                    
                        
                        {/* <FontAwesome name="circle" size={70} color={moduleColour} /> */}
                    
                </View>
                <View style={{paddingVertical: 5}}>
                    {/* <TouchableOpacity onPress={handleLayoutChange}>
                        <Text>horizontal</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity style={styles.navBTN}>
                        <Text>Notes</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <SectionList
                        contentContainerStyle={{gap: 15}}
                        sections={sections}
                        renderItem={renderItem}
                        renderSectionHeader={({section: category}) => (
                            <Text style={styles.header}>{category.title}</Text>
                        )}
                        // renderSectionFooter={}
                    />
                </View>
                <View style={{paddingTop:10}}>
                    <TouchableOpacity 
                        onPress={()=>router.push('(modals)/addCategory')}
                        style={{backgroundColor: moduleColour, borderRadius: 20, padding: 10, alignItems: 'center', borderWidth: 1}}
                    >
                        <Text>add category</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <Ionicons name='add-circle' size={80} color={moduleColour} onPress={handleOpenPress} style={styles.addTaskBTN}/>
            <AddTaskBottomSheet
                ref={bottomSheetRef}
                onAdd={(newTask) => 
                    handleTaskAdded({
                        id: generateTaskId(),
                        user_id: user!.id,
                        task_name: newTask.task_name,
                        task_description: newTask.task_description,
                        isCompleted: false,
                        created_at: new Date(),
                        module_id: newTask.module_id,
                        category_id: newTask.category_id
                    })
                }
            />
        </>
    )
}

const styles = StyleSheet.create ({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 730
    },
    header: {
        fontWeight: 'bold',
        fontSize: 30,
        paddingTop: 20,
        paddingBottom: 5
    },
    description: {
        fontSize: 20,
        paddingBottom: 10
    },
    navBTN: {
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10
    },
    moduleColour: {
        paddingTop: 20,
        borderRadius: 200/2,
        height: 70,
        width: 70,
        borderWidth: 1
    },
    addTaskBTN: {
        position: 'absolute',
        bottom: 10,
        right: 2
    }
})

export default ModuleDetail;