import { FlatList, Text, View, StyleSheet } from "react-native";
import { ReactNode, useEffect, useState } from "react";
import { Category, Task } from "@/types/types";
import { useTaskList } from "@/provider/TaskListProvider";
import TaskListItem from "./TaskListItem";
import DraggableFlatList from "react-native-draggable-flatlist";

// MAKE DRAGGABLE

interface Props {
    //tasks: TaskCat[];
    tasksByCategory: {[id: number]: Task[]};
    onCheckPressed: (task: Task) => void;
    onDelete: (task: Task) => void;
    onTaskPressed: (task: Task) => void;
    onEdit: (task: Task) => void;
    getPrioritySymbol: (task: Task) => ReactNode;
}


const TaskKanbanView = ({tasksByCategory, onCheckPressed, onDelete, onTaskPressed, onEdit, getPrioritySymbol} : Props) => {
    const { categories, updateCategory } = useTaskList();

    const categoryNames: {[id: number]: string} = {};
    categories.forEach((category) => {
        categoryNames[category.id] = category.category_name;
    })

    const groupedTasks = Object.entries(tasksByCategory).map(([categoryId, tasks]) => {
        return {
            category: Number(categoryId) === -1 ?  'uncategorized' : categoryNames[Number(categoryId)],
            data: tasks
        }
    })

    const updateTasksByCat = (newTasksByCategory: Category) => {
        updateCategory(newTasksByCategory);
    }
    
    return (
        <View style={styles.container}>
            <FlatList
                // horizontal
                // showsHorizontalScrollIndicator={false}
                numColumns={2}
                data={groupedTasks}
                renderItem={({item}) => (
                    <View style={{flex: 1, borderWidth: 1, paddingBottom: 20, borderRadius: 20}}>
                        <View style={{paddingLeft: 20, paddingTop: 15}}>
                            <Text style={styles.header}>{item.category}</Text>
                        </View>
                        <FlatList
                            data={item.data}
                            renderItem={({ item: task }) => (
                                <TaskListItem
                                    task={task}
                                    onCheckPressed={() => onCheckPressed(task)}
                                    onDelete={() => onDelete(task)}
                                    onTaskPressed={() => onTaskPressed(task)}
                                    onEdit={() => onEdit(task)}
                                    prioritySymbol={getPrioritySymbol(task)}
                                />
                            )}
                            keyExtractor={(task) => String(task.id)}
                            style={{flex: 1}}
                        />
                    </View>
                )}
                keyExtractor={(item, index) => item.category + index}
                columnWrapperStyle={{gap: 5, paddingBottom: 5}}
                ListEmptyComponent={
                    <View style={{padding: 10}}>
                        <View style={{ borderWidth: 1, borderRadius: 20, padding: 40, height: 460}}>
                            <Text style={{textAlign: 'center', top: '40%', fontSize: 16, fontWeight: '500'}}>
                                You haven't created any tasks yet! Tap the + button to create a new task.
                            </Text>
                        </View>
                    </View>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create ({ 
    container: {
        paddingHorizontal: 5,
        paddingTop: 10
    },
    header: {
        fontSize: 20,
        fontWeight: '600'
    }
})

export default TaskKanbanView;