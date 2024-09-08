import { useEffect, useState, useRef } from "react";
import { Text, View, StyleSheet, TextInput, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";

import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { supabase } from "@/config/initSupabase";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { useTaskList } from "@/provider/TaskListProvider";
import { useAuth } from "@/provider/AuthProvider";
import { Task } from '@/types/types';

import { Circle, Svg, Symbol, Use } from "react-native-svg";
import { Text as SvgText } from "react-native-svg";
import AddCategory from "@/components/AddCategory";
import TaskListView from "@/components/TaskListView";
import TaskKanbanView from "@/components/TaskKanbanView";
import ModuleNotes from "@/components/ModuleNotes";

const ModuleDetail = () => {
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const { onCheckPressed, onDelete, tasks, onTaskPressed } = useTaskList();
    const { user } = useAuth();

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const handleOpenPress = () => bottomSheetRef.current?.present();

    const [ moduleTitle, setModuleTitle ] = useState('');
    const [ moduleDesc, setModuleDesc ] = useState('');
    const [ moduleColour, setModuleColour ] = useState('');

    const [view, setView] = useState('list');
    const handleViewChange = (newView: 'list' | 'kanban' | 'notes') => {
        setView(newView);
    };

    useEffect(() => {
        console.log(id);
        id&&getModuleInfo();
    }, [id]);

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

    const modTasks = tasks.filter((task) => task.module_id === Number(id));

    const tasksByCategory = modTasks.reduce((acc: {[key: number]: Task[]}, task) => {
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

    // load priority symbols
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
                <View style={{paddingHorizontal: 20}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        {/* edit module details */}
                        <View style={{width: '70%'}}>
                            <TextInput 
                                placeholder="module title" 
                                value={moduleTitle || ''}
                                onChangeText={(text) => setModuleTitle(text)}
                                style={styles.header}
                                onEndEditing={() => updateModule({moduleTitle, moduleDesc, moduleColour})}
                                multiline
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
                            <TouchableOpacity>
                                <Svg height={80} width={80} viewBox="0 0 80 80">
                                    <Circle
                                        cx={40}
                                        cy={40}
                                        r={35}
                                        fill={moduleColour}
                                        stroke={'black'}
                                        strokeWidth={1}
                                    />
                                </Svg>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/* list, board, notes views nav bar */}
                <View style={{flexDirection: 'row', justifyContent: 'space-between',  paddingHorizontal: 20, alignItems: 'center'}}>
                    <View style={{flexDirection: 'row', gap: 10}}>
                        <TouchableOpacity 
                            style={[styles.navBTN, view === 'list' ? {backgroundColor: moduleColour} : {}]}
                            onPress={() => handleViewChange('list')}
                        >
                            <Text style={{textAlign: 'center', fontWeight: '600', fontSize: 13}}>List View</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.navBTN, view === 'kanban' ? {backgroundColor: moduleColour} : {}]}
                            onPress={() => handleViewChange('kanban')}
                        >
                            <Text style={{textAlign: 'center', fontWeight: '600', fontSize: 13}}>Board View</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.navBTN, view === 'notes' ? {backgroundColor: moduleColour} : {}]}
                            onPress={() => handleViewChange('notes')}
                        >
                            <Text style={{textAlign: 'center', fontWeight: '600', fontSize: 13}}>Notes</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        {/* add task btn */}
                        <TouchableOpacity style={styles.addTaskBTN} onPress={()=> router.navigate('/(auth)/(modals)/addTask')}>
                            <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                                <Ionicons name="add" size={20} color="black" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{height: '75%'}}>
                    {/* if list view btn pressed: */}
                    {view === 'list' ? (
                        <TaskListView
                            tasksByCategory={tasksByCategory}
                            onCheckPressed={onCheckPressed}
                            onDelete={onDelete}
                            onTaskPressed={onTaskPressed}
                            onEdit={onEditPressed}
                            getPrioritySymbol={getPrioritySymbol}
                        />
                    // if board view btn pressed:
                    ) : view === 'kanban' ? (
                        <TaskKanbanView
                            tasksByCategory={tasksByCategory}
                            onCheckPressed={onCheckPressed}
                            onDelete={onDelete}
                            onTaskPressed={onTaskPressed}
                            onEdit={onEditPressed}
                            getPrioritySymbol={getPrioritySymbol}
                        />
                    // if note view btn pressed:
                    ) : (
                        <ModuleNotes/>
                    )}
                </View>
                {/* add category btn */}
                <View style={{paddingTop: 5, justifyContent: 'center', width: 300, alignSelf: 'center'}}>
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
                            bottomSheetRef.current?.close();
                        }}
                    />
                </View>
            </SafeAreaView>
        </>            
    )
}

const styles = StyleSheet.create ({
    container: {
        flex:1,
        backgroundColor: 'white'
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
    },
    description: {
        fontSize: 20,
        paddingBottom: 15
    },
    navBTN: {
        borderWidth: 1,
        borderRadius: 20,
        padding: 10
    },
    addTaskBTN: {
        alignSelf: 'center',
        borderWidth: 1,
        padding: 6,
        borderRadius: 10,
        backgroundColor: '#A6F511'
    },
    pickerContainer: {
        alignSelf: 'center',
        width: 300,
        padding: 20,
        borderRadius: 20,
        
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    
        elevation: 10,
    },
    hueContainer: {
        justifyContent: 'center',
    },
    panelStyle: {
        width: '70%',
        height: '70%',
        alignSelf: 'center',
        borderRadius: 16,
    },
    swatchesContainer: {
        paddingTop: 20,
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: '#bebdbe',
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap: 10,
    },
    swatchStyle: {
        borderRadius: 20,
        height: 30,
        width: 30,
        margin: 0,
        marginBottom: 20,
        marginHorizontal: 0,
        marginVertical: 0,
    },
    selectColour: {
        borderRadius: 40,
        padding: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderWidth: 1
    },
})

export default ModuleDetail;