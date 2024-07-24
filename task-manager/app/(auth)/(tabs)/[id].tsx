import { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, SectionList, SectionListData, SectionListRenderItem, Module, FlatList, ListRenderItem } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";

import { router, useLocalSearchParams } from "expo-router";

import { supabase } from "@/config/initSupabase";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";

import TaskListItem from "@/components/TaskListItem";
import AddTaskBottomSheet from "@/components/AddTaskBottomSheet";

import { useTaskList, TaskCat, ModuleCat, Category } from "@/provider/TaskListProvider";
import { useAuth } from "@/provider/AuthProvider";
import CategoryList from "@/components/CategoryList";

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
    const { onCheckPressed, onDelete, tasks} = useTaskList();
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
        // id&&getModuleDetail();
        // getTasks();
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

    
    return (
        <>
            <SafeAreaView style={{paddingHorizontal: 20}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <View>
                        {/* change to text input so that users can edit module */}
                        <Text style={styles.header}>{moduleTitle}</Text>
                        <Text style={styles.description}>{moduleDesc}</Text>
                    </View>
                    <TouchableOpacity>
                        <FontAwesome name="circle" size={70} color={moduleColour} />
                    </TouchableOpacity>
                </View>
                <View>
                    {/* <TouchableOpacity onPress={handleLayoutChange}>
                        <Text>horizontal</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity>
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
                {/* <CategoryList
                    moduleCatList={moduleCatList}
                    catNames={catNames}
                    tasks={tasks}
                /> */}
                <View>
                    <TouchableOpacity 
                        onPress={()=>router.push('(modals)/addCategory')}
                        style={{backgroundColor: 'lightpink', borderRadius: 20, padding: 10, alignItems: 'center'}}
                    >
                        <Text>add category</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <Ionicons name='add-circle' size={80} color='#7BBF45' onPress={handleOpenPress} style={styles.addTaskBTN}/>
            <AddTaskBottomSheet
                ref={bottomSheetRef}
                onAdd={(newTask) => 
                    // setTaskList(tasks => [...tasks, newTask])
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
    addTaskBTN: {
        position: 'absolute',
        bottom: 10,
        right: 2
    }
})

export default ModuleDetail;