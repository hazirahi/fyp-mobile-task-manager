import { useTaskList } from "@/provider/TaskListProvider"
import { FlatList, ListRenderItem, View, Text, StyleSheet, SectionList, SectionListRenderItem, SectionListData } from "react-native";
import { TaskCat, ModuleCat } from "@/types/types";
import { Svg, Symbol, Circle, Use } from "react-native-svg";
import { Text as SvgText } from "react-native-svg";
import { router } from "expo-router";
import TaskListItem from "./TaskListItem";
import { ReactNode } from "react";

interface Props {
    //tasks: TaskCat[];
    tasksByCategory: {[id: number]: TaskCat[]};
    onCheckPressed: (task: TaskCat) => void;
    onDelete: (task: TaskCat) => void;
    onTaskPressed: (task: TaskCat) => void;
    onEdit: (task: TaskCat) => void;
    getPrioritySymbol: (task: TaskCat) => ReactNode;
}

const TaskListView = ({tasksByCategory, onCheckPressed, onDelete, onTaskPressed, onEdit, getPrioritySymbol} : Props) => {

    // const renderItem: ListRenderItem<{[id: number]: TaskCat[]}> = ({item, index}) => {
    //     const categoryId = Number(Object.keys(tasksByCategory)[index]);
    //     const tasks = tasksByCategory[categoryId]
    //     return (
    //         <View>
    //             <Text>{categoryId}</Text>
    //             {tasks.map((task) => (
    //                 <TaskListItem
    //                     key={task.id}
    //                     task={task}
    //                     onCheckPressed={() => onCheckPressed(task)}
    //                     onDelete={() => onDelete(task)}
    //                     onTaskPressed={() => onTaskPressed(task)}
    //                     onEdit={() => onEdit}
    //                     prioritySymbol={getPrioritySymbol(task)}
    //                 />
    //             ))}
    //         </View>
    //     )
    // }

    

    // const renderItem: SectionListRenderItem<{[id: number]: TaskCat[]}> = ({ item, section }) => {

    //     //console.log(item.category_id)
    //     return (
    //         <View>
    //             <Text>{section.title}</Text>
    //             {section.data.map((task) => (
    //                 <TaskListItem
    //                     key={task.id}
    //                     task={task}
    //                     onCheckPressed={() => onCheckPressed(task)}
    //                     onDelete={() => onDelete(task)}
    //                     onTaskPressed={() => onTaskPressed(task)}
    //                     onEdit={() => onEdit(task)}
    //                     prioritySymbol={getPrioritySymbol(task)}
    //                 />
    //             ))}
                
    //         </View>
    //     )
    // }

    const { categories } = useTaskList();
    const categoryNames: {[id: number]: string} = {};
    categories.forEach((category) => {
        categoryNames[category.id] = category.category_name;
    })

    const renderItem = ({item}: {item: TaskCat}) => {
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

    const renderSectionHeader = ({section}: {section: SectionListData<TaskCat>}) => {
        const categoryId = section.title;
        const categoryName = categoryNames[categoryId];
        //console.log(categoryId)
        return (
            <View style={{paddingLeft: 20, paddingTop: 15}}>
                <Text style={styles.header}>{categoryName}</Text>
            </View>
        )
    }

    return (
        <SectionList
            sections={Object.entries(tasksByCategory).map(([categoryId, tasks]) => ({
                title: categoryId,
                data: tasks
            }))}
            renderItem={renderItem}
            renderSectionHeader={renderSectionHeader}
            keyExtractor={(item) => item.id.toString()}
            stickySectionHeadersEnabled={false}
        />
    )
}

const styles = StyleSheet.create ({ 
    header: {
        fontSize: 23,
        fontWeight: '600'
    }
})

export default TaskListView;