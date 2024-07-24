import { View, Text, StyleSheet, FlatList, ListRenderItem } from "react-native";

import { ModuleCat, TaskCat, useTaskList } from "@/provider/TaskListProvider";
import TaskListItem from "./TaskListItem";

interface Props {
    moduleCatList: ModuleCat[];
    catNames: { [id: number]: string };
    tasks: TaskCat[];
}

export default function CategoryList ({moduleCatList, catNames, tasks}: Props) {

    const { onCheckPressed, onDelete } = useTaskList();

    const renderItem: ListRenderItem<ModuleCat> = ({ item }) => {
        const task = tasks.find((t) => t.id === item.task_id);
        if (!task)
            return null;

        const taskwithModuleId: TaskCat = { ...task, module_id: item.module_id};
        return (
            <View>
                <Text>{catNames[1]}</Text>
                <View>
                    <TaskListItem 
                        task={taskwithModuleId} 
                        onCheckPressed={() => onCheckPressed(taskwithModuleId)}
                        onDelete={() => onDelete(taskwithModuleId)}
                    />
                </View>
            </View>
            
        );
    };

    return (
        <View>
            <FlatList
                scrollEnabled={true}
                data={moduleCatList}
                keyExtractor={(item) => `${item.id}`}
                contentContainerStyle={{gap:15}}
                renderItem={renderItem}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    taskContainer: {
        padding:15,
        paddingVertical: 20,
        backgroundColor: 'gray',
        borderRadius: 15,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    taskTitle: {
        color: 'black',
        fontSize: 17,
        fontWeight: 600
    }
})
