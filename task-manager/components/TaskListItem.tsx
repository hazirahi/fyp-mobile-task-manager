import { View, Text, StyleSheet } from "react-native";

import { TaskCat } from "@/provider/TaskListProvider";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable } from "react-native-gesture-handler";

const RightActions = ({onDelete} : {onDelete: () => void;}) => {
    return (
        <View
            style={{
                alignItems: 'center',
                flexDirection: 'row',
                paddingLeft: 10
            }}
        >
            <MaterialCommunityIcons
                onPress={onDelete}
                name="delete-empty"
                size={24}
                color="red"
            />
        </View>
    );
};

type TaskListItem = {
    task: TaskCat;
    onCheckPressed: () => void;
    onDelete: () => void;
    onTaskPressed: () => void;
}

const TaskListItem = ({task, onCheckPressed, onDelete, onTaskPressed}: TaskListItem) => {
    return (
        <Swipeable
            renderRightActions={() => (
                <RightActions onDelete={onDelete}/>
            )}
        >
            <View style={styles.taskContainer}>
                <Text
                    onPress={onTaskPressed}
                    style={[styles.taskTitle, {
                        textDecorationLine: task.isCompleted
                        ? 'line-through'
                        : 'none',
                        color: task.isCompleted
                        ? 'dimgray'
                        : 'black',
                    },]}
                >
                    {task.task_name}
                </Text>
                <MaterialCommunityIcons
                    onPress={onCheckPressed}
                    name={
                        task.isCompleted
                        ? "checkbox-marked-circle"
                        : "checkbox-blank-circle-outline"
                    }
                    size={24}
                    color={
                        task.isCompleted
                        ? '#dimgray'
                        : 'dimgray'
                    }
                    
                />
            </View>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    taskContainer: {
        padding:15,
        paddingVertical: 20,
        backgroundColor: 'lightgray',
        // borderWidth: 1,
        borderRadius: 22,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    taskTitle: {
        fontSize: 17,
        fontWeight: '400'
    }
})

export default TaskListItem;