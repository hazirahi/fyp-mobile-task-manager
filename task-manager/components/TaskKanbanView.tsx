import { FlatList, Text, View, StyleSheet } from "react-native";
import { ReactNode, useState } from "react";
import { Category, TaskCat } from "@/types/types";
import { useTaskList } from "@/provider/TaskListProvider";
import TaskListItem from "./TaskListItem";
import DraggableFlatList from "react-native-draggable-flatlist";

// MAKE DRAGGABLE

interface Props {
    //tasks: TaskCat[];
    tasksByCategory: {[id: number]: TaskCat[]};
    onCheckPressed: (task: TaskCat) => void;
    onDelete: (task: TaskCat) => void;
    onTaskPressed: (task: TaskCat) => void;
    onEdit: (task: TaskCat) => void;
    getPrioritySymbol: (task: TaskCat) => ReactNode;
}


const TaskKanbanView = ({tasksByCategory, onCheckPressed, onDelete, onTaskPressed, onEdit, getPrioritySymbol} : Props) => {
    const { categories, updateCategory } = useTaskList();
    const categoryNames: {[id: number]: string} = {};
    categories.forEach((category) => {
        categoryNames[category.id] = category.category_name;
    })

    const groupedTasks = Object.entries(tasksByCategory).map(([categoryId, tasks]) => {
        return {
            category: categoryNames[Number(categoryId)],
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
                    <View style={{flex: 1, borderWidth: 1, paddingBottom: 10, borderRadius: 20}}>
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
                columnWrapperStyle={{gap: 5}}
                // onDragEnd={({data}) => {
                //     console.log('drag end: ', data)
                //     const newTaskByCategory = {};
                //     data.forEach((category: , index) => {
                //         newTaskByCategory[index] = tasksByCategory[category.category];
                //     });
                //     updateTasksByCat(newTaskByCategory);
                // }}
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
        fontSize: 23,
        fontWeight: '600'
    }
})

export default TaskKanbanView;