import { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, SectionList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";

import { router, useLocalSearchParams } from "expo-router";

import { supabase } from "@/config/initSupabase";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";

import TaskListItem from "@/components/TaskListItem";
import AddTaskBottomSheet from "@/components/AddTaskBottomSheet";
import { useTaskList, Task } from "@/provider/TaskListProvider";

//UPDATE SO THAT THIS SCREEN UPDATES IF A TASK IS ADDED IN THE MODULE SCREEN

const ModuleDetail = () => {
    const { id } = useLocalSearchParams();
    const { onCheckPressed, onDelete, getTasks } = useTaskList();

    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleOpenPress = () => bottomSheetRef.current?.expand();
    const [taskList, setTaskList] = useState<Array<Task>>([]);

    const [ moduleTitle, setModuleTitle ] = useState('');
    const [ moduleDesc, setModuleDesc ] = useState('');
    const [ moduleColour, setModuleColour ] = useState('');

    const [taskCategoryList, setTaskCategoryList] = useState<any[]>([]);

    useEffect(() => {
        console.log(id)
        id&&getModuleInfo();
        id&&getModuleDetail();
        getTasks();
    }, [id])

    const getModuleDetail = async () => {
        const { data: modules, error } = await supabase
            .from('modules')
            .select(`
                *, 
                tasks(*, categories(*))
            `)
            .eq('id', id)
        if (modules){
            
            const { data: categories } = await supabase.from('categories').select('*, tasks(*)');
            const { data: tasks } = await supabase.from('tasks').select('*, categories(*), modules(*)').eq('module_id', id);

           
            const catGrouped: any = categories?.map((category: any) => {
                const items = tasks?.filter((task: any) => category.id === task.category_id);
                return {...category, data: items}
            })
            setTaskCategoryList(catGrouped);
            
        }
    }

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
                        <Text style={styles.header}>{moduleTitle}</Text>
                        <Text style={styles.description}>{moduleDesc}</Text>
                    </View>
                    <TouchableOpacity>
                        <FontAwesome name="circle" size={70} color={moduleColour} />
                    </TouchableOpacity>
                </View>
                <View>
                    <SectionList
                        contentContainerStyle={{gap: 15}}
                        sections={taskCategoryList}
                        renderItem={({ item: task }) => (
                            // <TouchableOpacity>
                            //     <Text >{task.task_name}</Text>
                            // </TouchableOpacity>
                            <TaskListItem 
                                    task={task}
                                    onCheckPressed={() => onCheckPressed(task)}
                                    onDelete={() => onDelete(task)}
                            />
                        )}
                        renderSectionHeader={({section: category}) => (
                            <Text style={styles.header}>{category.category_name}</Text>
                        )}
                        // renderSectionFooter={}
                    />
                </View>
                <View>
                    <TouchableOpacity 
                        onPress={()=>router.navigate('(modals)/addCategory')}
                        style={{backgroundColor: 'lightpink', borderRadius: 20, padding: 10, alignItems: 'center'}}
                    >
                        <Text>add category</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            {/* <Ionicons name='add-circle' size={80} color='#7BBF45' onPress={handleOpenPress} style={styles.addTaskBTN}/>
            <AddTaskBottomSheet
                ref={bottomSheetRef}
                onAdd={(newTask: Task) => 
                    setTaskList(tasks => [...tasks, newTask])
                }
            /> */}
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