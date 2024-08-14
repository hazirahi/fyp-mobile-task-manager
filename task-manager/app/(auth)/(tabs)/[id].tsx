import { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, TextInput, ListRenderItem, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";

import { router, useLocalSearchParams } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { supabase } from "@/config/initSupabase";
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";

import TaskListItem from "@/components/TaskListItem";
// import AddTaskBottomSheet from "@/components/AddTaskBottomSheet";

import { useTaskList } from "@/provider/TaskListProvider";
import { useAuth } from "@/provider/AuthProvider";
import { Task } from '@/types/types';

import { Circle, Svg, Symbol, Use } from "react-native-svg";
import { Text as SvgText } from "react-native-svg";
import AddCategory from "@/components/AddCategory";
import TaskListView from "@/components/TaskListView";
import TaskKanbanView from "@/components/TaskKanbanView";


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
    const { onCheckPressed, onDelete, tasks, onTaskPressed, categories, getCategory, getTasks } = useTaskList();
    const { user } = useAuth();

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const handleOpenPress = () => bottomSheetRef.current?.present();
    const [taskList, setTaskList] = useState<Task[]>([]);

    const handleTaskAdded = (newTask: Task) => {
        setTaskList([...taskList, newTask]);
    };

    // const [layoutType, setLayoutType] = useState('vertical');

    // const handleLayoutChange = () => {
    //     setLayoutType(layoutType === 'vertical' ? 'horizontal' : 'vertical');
    // }

    const [ moduleTitle, setModuleTitle ] = useState('');
    const [ moduleDesc, setModuleDesc ] = useState('');
    const [ moduleColour, setModuleColour ] = useState('');

    const [view, setView] = useState('list');
    const handleViewChange = (newView: 'list' | 'kanban') => {
        setView(newView);
    };

    //const [ moduleTasks, setModuleTasks ] = useState<Task

    // const [moduleCatList, setModuleCatList] = useState<ModuleCat[]>([]);
    // const [categorizedTasks, setCategorizedTasks] = useState<{[id: number]: TaskCat[]}>({});
    // const [catNames, setCatNames] = useState<{[id:number]:string}>({});

    let taskIdCounter = 0;

    const generateTaskId = () => {
        return ++taskIdCounter;
    }
    
    useEffect(() => {
        console.log(id);
        id&&getModuleInfo();
        //getModuleCat();
        getModuleTasks();
    }, [id]);

    useEffect(() => {
        
    })

    // const getCatTasks = async () => {
    //     const { data: modCat, error } = await supabase
    //         .from('tasks')
    //         .select('*')
    //         .eq
    // }

    // useEffect(() => {
    //     const catNamesObj = categories.reduce((acc: any, category) => {
    //         acc[category.id] = category.category_name;
    //         return acc;
    //     }, {});
    //     setCatNames(catNamesObj);
    //     getCategory();
    // }, []);

    // useEffect(() => {
    //     const categorizedTasksObj = tasks.reduce((acc: any, task) => {
    //         const categoryId = task.category_id;
    //         if (categoryId !== null && categoryId !== undefined) {
    //             if (!acc[categoryId]) {
    //                 acc[categoryId] = [];
    //             }
    //             acc[categoryId].push(task);
    //         }
            
    //         return acc;
    //     }, {});
    //     setCategorizedTasks(categorizedTasksObj);
    //     getTasks();
    // }, [])

    // useEffect(() => {
    //     const categoryIds = Array.from(new Set(moduleCatList.map((moduleCat) => moduleCat.category_id))).filter((id) => id !== null);
    //     getCatNames(categoryIds).then((catNames) => setCatNames(catNames));

    //     const taskIds = Array.from(new Set(moduleCatList.map((moduleCat) => moduleCat.task_id)));
    //     // getModuleTasks(taskIds).then((taskNames) => setTaskNames(taskNames));
    // },[moduleCatList]);

    // const getModuleCat = async () => {
    //     const {data: moduleCatList} = await supabase
    //         .from('module_categories')
    //         .select(`*, categories(*), tasks(*)`)
    //         .eq('module_id', id)
    //     if (moduleCatList)
    //         setModuleCatList(moduleCatList!);
    // }

    // const sections: SectionListData<ModuleCat>[] = Object.entries(catNames).map(([categoryId, catName]) => ({
    //     title: catName,
    //     data: moduleCatList.filter((moduleCat) => moduleCat.category_id === parseInt(categoryId, 10)),
    // }));


    // const renderItem: SectionListRenderItem<ModuleCat> = ({ item }) => {
    //     const task = tasks.find((t) => t.id === item.task_id);
    //     if (!task)
    //         return null;

    //     const taskwithModuleId: TaskCat = { ...task, module_id: item.module_id};
    //     return (
    //         <TaskListItem 
    //             task={taskwithModuleId} 
    //             onCheckPressed={() => onCheckPressed(taskwithModuleId)}
    //             onDelete={() => onDelete(taskwithModuleId)}
    //             onTaskPressed={()=> onTaskPressed(taskwithModuleId)}
    //         />
    //     );
    // };


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

    const getModuleTasks = async () => {
        const { data: modTasks, error } = await supabase
            .from('tasks')
            .select('*, categories(*)')
            .eq('module_id', id)
        if (error) {
            console.log(error.message)
        } else {
            //console.log(modTasks)
            setTaskList(modTasks!);
            
        }
    }

    const tasksByCategory = taskList.reduce((acc: {[key: number]: Task[]}, task) => {
        if (task.category_id !== null){
            const categoryId = task.category_id;
            if (!acc[categoryId]) {
                acc[categoryId] = [];
            }
            acc[categoryId].push(task);
        } else {
            if (!acc[-1]) {
                acc[-1] = [];
            }
            acc[-1].push(task);
        }
        
        return acc;
    }, {})

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

    // interface moduleCatWithCatName extends ModuleCat{
    //     category_name: string | null;
    // }

    // const data: moduleCatWithCatName[] = moduleCatList.map((moduleCat) => ({
    //     ...moduleCat,
    //     category_name: moduleCat.category_id? catNames[moduleCat.category_id] : null,
    // }));

    // const data: TaskCat[] = tasks.map((task) => ({
    //     ...task,
    //     module_cat_task: {
    //         module_id: task.module_id,
    //         category_id: task.category_id,
    //         task: task
    //     }
    // }))

    // const renderItem: ListRenderItem<moduleCatWithCatName> = ({item, index}) => {
    //     const task = tasks.find((t) => t.id === item.task_id);
    //     if(!task) return null;

    //     const taskwithModuleId: TaskCat = { ...task, module_id: item.module_id };
    //     const isFirstInCat = index === 0 || data[index-1].category_id !== item.category_id;

    //     const getPrioritySymbol = (task: TaskCat) => {
    //         switch (task.priority_id) {
    //             //low
    //             case 1:
    //                 return (
    //                     <View style={{position: 'absolute'}}>
    //                         <Svg height="40" width="45" pointerEvents="none">
    //                         <Symbol id="symbol" viewBox="0 0 80 90">
    //                             <Circle cx='0' cy='0' r='40' fill='#FFBB00' />
    //                             <Circle cx='30' cy='20' r='25' fill='#FFBB00' />
    //                         </Symbol>
    //                         <Use href="#symbol" x={0} y={20} width={75} height={38}/>
    //                         <SvgText
    //                             x={20}
    //                             y={21}
    //                             textAnchor="middle"
    //                             alignmentBaseline="middle"
    //                             fontWeight={'900'}
    //                             fontSize={16}
    //                             fill={'white'}
    //                         >!</SvgText>
    //                     </Svg>
    //                     </View>
                        
    //                 )
    //             // medium
    //             case 2:
    //                 return (
    //                     <View style={{position: 'absolute'}}>
    //                     <Svg height="40" width="45" pointerEvents="none">
    //                         <Symbol id="symbol" viewBox="0 0 80 90">
    //                             <Circle cx='0' cy='0' r='40' fill='#FF8800' />
    //                             <Circle cx='30' cy='20' r='25' fill='#FF8800' />
    //                         </Symbol>
    //                         <Use href="#symbol" x={0} y={20} width={75} height={38}/>
    //                         <SvgText
    //                             x={20}
    //                             y={21}
    //                             textAnchor="middle"
    //                             alignmentBaseline="middle"
    //                             fontWeight={'900'}
    //                             fontSize={16}
    //                             fill={'white'}
    //                         >!!</SvgText>
    //                     </Svg>
    //                     </View>
    //                 )
    //             // high
    //             case 3:
    //                 return (
    //                     <View style={{position: 'absolute'}}>
    //                     <Svg height="40" width="45" pointerEvents="none">
    //                         <Symbol id="symbol" viewBox="0 0 80 90">
    //                             <Circle cx='0' cy='0' r='40' fill='#E51F1F' />
    //                             <Circle cx='30' cy='20' r='25' fill='#E51F1F' />
    //                         </Symbol>
    //                         <Use href="#symbol" x={0} y={20} width={75} height={38}/>
    //                         <SvgText
    //                             x={20}
    //                             y={21}
    //                             textAnchor="middle"
    //                             alignmentBaseline="middle"
    //                             fontWeight={'900'}
    //                             fontSize={16}
    //                             fill={'white'}
    //                         >!!!</SvgText>
    //                     </Svg>
    //                     </View>
    //                 )
    //             default:
    //                 return null;
    //         }
    //     }
        
    //     const onEditPressed = (task: TaskCat) => {
    //         console.log(task.id);
    //         router.navigate({pathname: '/editTask', params: {taskId: task.id}});
    //     }

    //     return (
    //         <View>
    //             {isFirstInCat && <Text style={[styles.header, {paddingHorizontal: 20}]}>{item.category_name}</Text>}
    //             <TaskListItem
    //                 task={taskwithModuleId}
    //                 onCheckPressed={()=>onCheckPressed(taskwithModuleId)}
    //                 onDelete={()=>onDelete(taskwithModuleId)}
    //                 onEdit={() => onEditPressed(taskwithModuleId)}
    //                 onTaskPressed={()=>onTaskPressed(taskwithModuleId)}
    //                 prioritySymbol={getPrioritySymbol(taskwithModuleId)}
    //             />
    //         </View>
    //     )
    // }

    // const filteredTasks = data.flatMap((moduleCat) => {
    //     const task = tasks.find((t) => t.id === moduleCat.task_id);
    //     if(!task) return [];
    //     return [{...task, module_id: moduleCat.module_id}]
    // })

    // const filteredTasks = data;

    
    
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
    
    const onEditPressed = (task: Task) => {
        console.log(task.id);
        router.navigate({pathname: '/editTask', params: {taskId: task.id}});
    }


    return (
        <>
            <SafeAreaView style={styles.container}>
                <LinearGradient 
                    colors={[moduleColour,'#FFFFFF']}
                    style={styles.background}
                />
                <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20}}>
                    <View>
                        <TextInput 
                            placeholder="module title" 
                            value={moduleTitle || ''}
                            onChangeText={(text) => setModuleTitle(text)}
                            style={[styles.header, {paddingBottom: 5}]}
                            onEndEditing={() => updateModule({moduleTitle, moduleDesc, moduleColour})}
                        />
                        <TextInput 
                            placeholder="module desc"
                            value={moduleDesc || ''} 
                            onChangeText={(text) => setModuleDesc(text)} 
                            style={styles.description} 
                            onEndEditing={() => updateModule({moduleTitle, moduleDesc, moduleColour})} 
                            multiline
                        />
                    </View>
                    <View style={{paddingTop: 10}}>
                        <TouchableOpacity style={[styles.moduleColour, {backgroundColor: moduleColour}]}/>
                    </View>
                </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between',  paddingHorizontal: 20, alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', gap: 10}}>
                            <TouchableOpacity 
                                style={[styles.navBTN, view === 'list' ? {backgroundColor: moduleColour} : {}]}
                                onPress={() => handleViewChange('list')}
                            >
                                <Text style={{textAlign: 'center', fontWeight: '600'}}>List View</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.navBTN, view === 'kanban' ? {backgroundColor: moduleColour} : {}]}
                                onPress={() => handleViewChange('kanban')}
                            >
                                <Text style={{textAlign: 'center', fontWeight: '600'}}>Board View</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.addTaskBTN} onPress={()=> router.navigate('/(auth)/(modals)/addTask')}>
                                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                                    <Ionicons name="add" size={20} color="black" />
                                    {/* <Text style={{fontWeight: '600', fontSize: 13}}>Add Task</Text> */}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{height: '75%'}}>
                        {view === 'list' ? (
                            <TaskListView
                                tasksByCategory={tasksByCategory}
                                onCheckPressed={onCheckPressed}
                                onDelete={onDelete}
                                onTaskPressed={onTaskPressed}
                                onEdit={onEditPressed}
                                getPrioritySymbol={getPrioritySymbol}
                            />
                        ) : (
                            <TaskKanbanView
                                tasksByCategory={tasksByCategory}
                                onCheckPressed={onCheckPressed}
                                onDelete={onDelete}
                                onTaskPressed={onTaskPressed}
                                onEdit={onEditPressed}
                                getPrioritySymbol={getPrioritySymbol}
                            />
                        )}
                    </View>
                    <View style={{paddingTop: 15, justifyContent: 'center', width: 300, alignSelf: 'center'}}>
                        <TouchableOpacity 
                            onPress={handleOpenPress}
                            style={{backgroundColor: moduleColour, borderRadius: 20, padding: 10, alignItems: 'center', borderWidth: 1}}
                        >
                            <Text style={{fontWeight: '500'}}>Add Category</Text>
                        </TouchableOpacity>
                        <AddCategory
                            ref={bottomSheetRef}
                            moduleId={Number(id)}
                            onAdd={(newCategory, id) => {
                                console.log(newCategory, id)
                                //addNewCat(newCategory, id)
                                bottomSheetRef.current?.close();
                            }}
                        />
                    </View>
                </SafeAreaView>
            </>    

            //     {/* <FlatList
            //         //style={{paddingHorizontal: 20}}
            //         data={data}
            //         renderItem={renderItem}
            //         keyExtractor={(item) => item.id.toString()}
            //         //contentContainerStyle={{gap:15}}
            //         ListHeaderComponent={
            //             <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20}}>
            //                 <View>
            //                     <TextInput 
            //                         placeholder="module title" 
            //                         value={moduleTitle || ''}
            //                         onChangeText={(text) => setModuleTitle(text)}
            //                         style={[styles.header, {paddingBottom: 5}]}
            //                         onEndEditing={() => updateModule({moduleTitle, moduleDesc, moduleColour})}
            //                     />
            //                     <TextInput 
            //                         placeholder="module desc"
            //                         value={moduleDesc || ''} 
            //                         onChangeText={(text) => setModuleDesc(text)} 
            //                         style={styles.description} 
            //                         onEndEditing={() => updateModule({moduleTitle, moduleDesc, moduleColour})} 
            //                         multiline
            //                     />
            //                 </View>
            //                 <View style={{paddingTop: 10}}>
            //                     <TouchableOpacity style={[styles.moduleColour, {backgroundColor: moduleColour}]}/>
            //                 </View>
            //             </View>
            //         }
            //         ListFooterComponent={
            //             <View style={{paddingTop:10, paddingHorizontal: 20}}>
            //                 <TouchableOpacity 
            //                     onPress={handleOpenPress}
            //                     style={{backgroundColor: moduleColour, borderRadius: 20, padding: 10, alignItems: 'center', borderWidth: 1}}
            //                 >
            //                     <Text>add category</Text>
            //                 </TouchableOpacity>
            //                 <AddCategory
            //                     ref={bottomSheetRef}
            //                     moduleId={Number(id)}
            //                     onAdd={(newCategory, id) => {
            //                         console.log(newCategory, id)
            //                         //addNewCat(newCategory, id)
            //                         bottomSheetRef.current?.close();
            //                     }}
            //                 />
            //             </View>
            //         }
                    
            //     />
            
            //     <View style={{paddingVertical: 5}}> 
            //         {/* <TouchableOpacity onPress={handleLayoutChange}>
            //             <Text>horizontal</Text>
            //         </TouchableOpacity> 
            //         <TouchableOpacity style={styles.navBTN}>
            //             <Text>Notes</Text>
            //         </TouchableOpacity>
            //     </View>
            //     <View>
            //         <SectionList
            //             contentContainerStyle={{gap: 15}}
            //             sections={sections}
            //             renderItem={renderItem}
            //             renderSectionHeader={({section: category}) => (
            //                 <Text style={styles.header}>{category.title}</Text>
            //             )}
            //             stickySectionHeadersEnabled={false}
            //         />
            //     </View>
                
            
            // <Ionicons name='add-circle' size={80} color={moduleColour} onPress={handleOpenPress} style={styles.addTaskBTN}/>
            // <AddTaskBottomSheet
            //     ref={bottomSheetRef}
            //     onAdd={(newTask) => 
            //         handleTaskAdded({
            //             id: generateTaskId(),
            //             user_id: user!.id,
            //             task_name: newTask.task_name,
            //             task_description: newTask.task_description,
            //             isCompleted: false,
            //             created_at: new Date(),
            //             module_id: newTask.module_id,
            //             category_id: newTask.category_id
            //         })
            //     }
            // /> */}
        
    )
}

const styles = StyleSheet.create ({
    container: {
        flex:1,
        backgroundColor: 'white',
        // paddingHorizontal: 20
    },
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
        paddingTop: 15,
        //paddingBottom: 10
    },
    description: {
        fontSize: 20,
        paddingBottom: 10
    },
    navBTN: {
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        width: 100
    },
    moduleColour: {
        paddingTop: 20,
        borderRadius: 200/2,
        height: 70,
        width: 70,
        borderWidth: 1
    },
    addTaskBTN: {
        alignSelf: 'center',
        borderWidth: 1,
        padding: 6,
        borderRadius: 10,
        backgroundColor: '#A6F511'
    },
})

export default ModuleDetail;