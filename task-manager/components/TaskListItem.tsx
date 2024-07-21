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
}

const TaskListItem = ({task, onCheckPressed, onDelete}: TaskListItem) => {
    return (
        <Swipeable
            renderRightActions={() => (
                <RightActions onDelete={onDelete}/>
            )}
        >
            <View style={styles.taskContainer}>
                <Text
                    style={[styles.taskTitle, {
                        textDecorationLine: task.isCompleted
                        ? 'line-through'
                        : 'none',
                        color: task.isCompleted
                        ? '#B8BBD3'
                        : 'white',
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
                        ? '#B8BBD3'
                        : 'white'
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

export default TaskListItem;