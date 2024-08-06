import { SafeAreaView, View, TouchableOpacity, StyleSheet, ScrollView, Text, TextInput, Keyboard } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useState, useRef } from "react"
import { supabase } from "@/config/initSupabase"
import { useTaskList } from "@/provider/TaskListProvider"
import { Priority } from "@/types/types"
import { Dropdown } from "react-native-element-dropdown"
import AddDateTimePicker from "@/components/AddDateTimePicker"
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import dayjs from "dayjs";
import { useAuth } from "@/provider/AuthProvider"


const EditTask = () => {
    const { taskId } = useLocalSearchParams();
    const { user } = useAuth();
    const { priorities, modules, categories } = useTaskList();
    const [loading, setLoading] = useState(true);

    const [taskName, setTaskName] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [taskPriority, setTaskPriority] = useState<number>(0);
    const [taskModule, setTaskModule] = useState<number>(0);
    const [taskCategory, setTaskCategory] = useState<number>(0);

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const handleOpenPress = () => bottomSheetRef.current?.present();

    const [date, setDate] = useState<Date | null>(new Date());
    const [dueDate, setDueDate] = useState('Due Date');

    const handleDueDateChange = (date: Date | null) => {
        if(date) {
            setDueDate(dayjs(date).format('DD-MM-YYYY'));
            setDate(date);
        } else {
            setDueDate('Due Date');
            setDate(null);
        }
    }

    useEffect(() => {
        taskId&&getTaskInfo();
    }, [taskId]);

    const getTaskInfo = async () => {
        const { data: tasks, error } = await supabase
            .from('tasks')
            .select('*, modules(*, module_categories(*, categories(*)))')
            .eq('id', taskId)
            .single()
        if (error)
            console.log(error.message)
        else {
            setTaskName(tasks.task_name);
            setTaskDesc(tasks.task_description);
            const selectedPriority = priorities.find((priority) => priority.id === tasks.priority_id);
            setSelectedPriority(selectedPriority);
            setTaskModule(tasks.module_id);
            if (tasks.due_date) {
                const dueDateValue = dayjs(tasks.due_date).format('DD-MM-YYYY');
                setDueDate(dueDateValue);
                setDate(new Date(tasks.due_date));
            }
            
            if (tasks.modules && tasks.modules.module_categories && tasks.modules.module_categories.length > 0) {
                const category = tasks.modules.module_categories[0].categories;
                if (category) {
                    setTaskCategory(category.id)
                }
            }
        }
    }

    const [selectedPriority, setSelectedPriority] = useState<Priority | null | undefined>(null);
  
    const handlePress = (priority: any) => {
        setSelectedPriority(priority);
        setTaskPriority(priority.id);
    };

    async function updateTask({
        taskName,
        taskDesc,
        taskPriority,
        taskModule,
        date,
        taskCategory
    } : {
        taskName: string
        taskDesc: string | null
        taskPriority: number | null
        taskModule: number | null
        date: Date | null
        taskCategory: number | null
    }) {
        try {
            setLoading(true);
            if (!user)
                throw new Error('no user on session')
            const updates = {
                user_id: user.id,
                id: taskId,
                task_name: taskName,
                task_description: taskDesc,
                due_date: date,
                module_id: taskModule,
                priority_id: taskPriority
            }
            console.log('task update: ', updates)

            const { error } = await supabase
                .from('tasks')
                .upsert(updates)
            if (error) {
                throw error
            } else {
                const { data: moduleCat, error: moduleCatError} = await supabase
                    .from('module_categories')
                    .upsert({
                        category_id: taskCategory,
                        module_id: taskModule
                    })
                    .eq('user_id', user!.id)
                if (moduleCatError)
                    console.log(moduleCatError.message);
            }
        } catch (error) {
            if (error instanceof Error)
                alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#8CDCF9', '#FFFFFF', '#8CDCF9']}
                style={styles.background}
            />
            <View style={{paddingLeft: 15, width: 40}}>
                <TouchableOpacity onPress={() => router.navigate('/home')}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <ScrollView style={{paddingHorizontal: 20}} keyboardShouldPersistTaps='handled'>
                <View>
                    <Text style={{fontWeight: '600', fontSize: 20, paddingBottom: 5}}>Task:</Text>
                    <TextInput
                        style={{padding: 15, backgroundColor: 'white', borderWidth: 1, borderRadius: 15}}
                        value={taskName || ''}
                        onChangeText={(text) => setTaskName(text)}
                        onEndEditing={() => Keyboard.dismiss()}
                    />
                </View>
                <Text style={{fontWeight: '600', fontSize: 20, paddingBottom: 10}}>Optional:</Text>
                <View style={{paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, borderWidth: 1}}>
                    <View style={{paddingVertical: 10}}>
                        <Text style={{fontWeight: '500', fontSize: 17, paddingBottom: 5}}>Description:</Text>
                        <TextInput
                                style={{padding: 15, backgroundColor: 'white', borderWidth: 1, borderRadius: 15}}
                                multiline={true}
                                value={taskDesc || ''}
                                onChangeText={(text) => setTaskDesc(text)}
                                onEndEditing={() => Keyboard.dismiss()}
                        />
                    </View>
                    <View style={{paddingVertical: 10}}>
                        <Text style={{fontWeight: '500', fontSize: 17, paddingBottom: 5}}>Priority:</Text>
                        <View style={styles.priorityContainer}>
                            {priorities.map((priority, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.priorityButton,
                                        selectedPriority === priority && styles.selectedPriorityButton,
                                    ]}
                                    onPress={() => {
                                        handlePress(priority);
                                    }}
                                >
                                    <Text style={styles.priorityText}>{priority.priority}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <View style={{flexDirection:'row', justifyContent: 'space-between', paddingVertical: 10}}>
                        <View style={{width: '50%'}}>
                            <Text style={{fontWeight: '500', fontSize: 17, paddingBottom: 5}}>Module:</Text>
                            <Dropdown
                                style={[styles.dropdown]}
                                data={modules}
                                labelField='module_title'
                                valueField='id'
                                placeholder={modules.find((module) => module.id === taskModule)?.module_title}
                                onChange={item => {
                                    setTaskModule(item.id);
                                }}
                            />
                        </View>
                        <View style={{width: '40%'}}>
                            <Text style={{fontWeight: '500', fontSize: 17, paddingBottom: 5}}>Due Date:</Text>
                            <TouchableOpacity
                                style={[styles.dropdown]}
                                onPress={handleOpenPress}
                            >
                                <Text style={{textAlign: 'center', fontSize: 15}}>{dueDate}</Text>
                            </TouchableOpacity>
                            <AddDateTimePicker
                                ref={bottomSheetRef}
                                onAdd={(startDate) => {
                                    handleDueDateChange(startDate);
                                    bottomSheetRef.current?.close();
                                }}
                            />
                        </View>
                    </View>
                    <View style={{paddingVertical: 10}}>
                        <Text style={{fontWeight: '500', fontSize: 17, paddingBottom: 5}}>Category: </Text>
                        <Dropdown
                            style={styles.dropdown}
                            data={categories}
                            labelField='category_name'
                            valueField='id'
                            placeholder={categories.find((category) => category.id === taskCategory)?.category_name}
                            onChange={item => {
                                setTaskCategory(item.id);
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
            <View style={{padding: 20, position: 'absolute', bottom: 20}}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => {
                        updateTask({taskName, taskDesc, taskPriority, taskModule, date, taskCategory})
                        router.navigate('/home');
                    }}
                >
                    <Text style={{padding: 10, paddingHorizontal: 25, textAlign: 'center', fontWeight: '600', fontSize: 16}}>Add Task</Text>
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
    priorityContainer: {
        backgroundColor: '#A6F511',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        borderRadius: 25,
        borderWidth: 1
    },
    priorityButton: {
        padding: 10,
        borderRadius: 20,
        width: 100,
    },
    selectedPriorityButton: {
        backgroundColor: 'white',
    },
    priorityText: {
        fontSize: 16,
        color: 'black',
        textAlign: 'center'
    },
    dropdown: {
        backgroundColor: '#F6FF78',
        padding: 15,
        borderRadius: 30,
        //width: '40%',
        paddingLeft: 15,
        borderWidth: 1
    },
    saveButton: {
        alignSelf: 'center',
        backgroundColor: '#A6F511',
        borderRadius: 20,
        width: 348,
        borderWidth: 1
    },
})

export default EditTask;