import { View, Text, StyleSheet } from "react-native";

import { TaskCat } from "@/types/types";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";

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
        <LinearGradient
            colors={['#FFFFFF', '#F6FF78', '#D5FF61', '#A6F511']}
            style={styles.taskContainer}
        >
            <View style={{flexDirection: 'row',
        justifyContent: 'space-between',}}>
                <Text
                    onPress={onTaskPressed}
                    style={[styles.taskTitle, {
                        textDecorationLine: task.isCompleted
                        ? 'line-through'
                        : 'none',
                        color: task.isCompleted
                        ? '#00CC44'
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
                        ? '#00CC44'
                        : 'black'
                    }
                    
                />
            </View>
            </LinearGradient>
        </Swipeable>
        
    );
};

const styles = StyleSheet.create({
    taskContainer: {
        padding:15,
        paddingVertical: 17,
        // backgroundColor: '#8CDCF9',
        borderWidth: 1,
        borderRadius: 17,
        
        // borderColor: '#0084FF'
    },
    taskTitle: {
        fontSize: 17,
        fontWeight: '400'
    }
})

export default TaskListItem;