import { ReactNode} from "react";
import { View, Text, StyleSheet, SectionList, SectionListData } from "react-native";

import { Task } from "@/types/types";
import { useTaskList } from "@/provider/TaskListProvider"
import TaskListItem from "./TaskListItem";

interface Props {
    //tasks: TaskCat[];
    tasksByCategory: {[id: number]: Task[]};
    onCheckPressed: (task: Task) => void;
    onDelete: (task: Task) => void;
    onTaskPressed: (task: Task) => void;
    onEdit: (task: Task) => void;
    getPrioritySymbol: (task: Task) => ReactNode;
}

const TaskListView = ({tasksByCategory, onCheckPressed, onDelete, onTaskPressed, onEdit, getPrioritySymbol} : Props) => {

    const { categories } = useTaskList();

    const categoryNames: {[id: number]: string} = {};
    categories.forEach((category) => {
        categoryNames[category.id] = category.category_name;
    })

    categoryNames[-1] = 'uncategorized'

    const renderItem = ({item}: {item: Task}) => {
        return (
            <TaskListItem
                task={item}
                onCheckPressed={() => onCheckPressed(item)}
                onDelete={() => onDelete(item)}
                onTaskPressed={() => onTaskPressed(item)}
                onEdit={() => onEdit(item)}
                prioritySymbol={getPrioritySymbol(item)}
            />
        )
    }

    const renderSectionHeader = ({section}: {section: SectionListData<Task>}) => {
        const categoryName = categoryNames[section.title];
        return (
            <View style={{paddingLeft: 20, paddingTop: 15}}>
                <Text style={styles.header}>{categoryName || 'uncategorized'}</Text>
            </View>
        )
    }

    const sections = Object.entries(tasksByCategory).map(([categoryId, tasks]) => ({
        title: parseInt(categoryId) === -1 ? 'uncategorized' : parseInt(categoryId),
        data: tasks
    }));

    return (
        <SectionList
            sections={sections}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={(item) => item.id.toString()}
            stickySectionHeadersEnabled={false}
            ListEmptyComponent={
                <View style={{padding: 20}}>
                    <View style={{ borderWidth: 1, borderRadius: 20, padding: 40, height: 460}}>
                        <Text style={{textAlign: 'center', top: '40%', fontSize: 16, fontWeight: '500'}}>
                            You haven't created any tasks yet! Tap the + button to create a new task.
                        </Text>
                    </View>
                </View>
            }
        />
    )
}

const styles = StyleSheet.create ({ 
    header: {
        fontSize: 20,
        fontWeight: '600'
    }
})

export default TaskListView;