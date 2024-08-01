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
                color="#E51F1F"
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
    const getBorderColour = () => {
        switch (task.priority_id) {
            // low
            case 1:
                return '#FFBB00';
            // medium
            case 2:
                return '#FF8800';
            // high
            case 3:
                return '#E51F1F';
            // default
            default:
                return 'black';
        }  
    }

    const getGradientColours = () => {
        switch (task.priority_id) {
            // low
            case 1:
                return ['#FFFFFF', '#FFF478', '#FFEE35', '#FFE100'];
            // medium
            case 2:
                return ['#FFFFFF', '#FFBE56', '#FFBE56', '#FF9500'];
            // high
            case 3:
                return ['#FFFFFF', '#FF859F', '#FF6171', '#F40000'];
            // default
            default:
                return ['#FFFFFF', '#F6FF78', '#D5FF61', '#A6F511'];
        }
    }

    return (
        
        <Swipeable
            renderRightActions={() => (
                <RightActions onDelete={onDelete}/>
            )}
        >
        <LinearGradient
            colors={getGradientColours()}
            // colors={['#FFFFFF', '#F6FF78', '#D5FF61', '#A6F511']}
            // colors={['#FFFFFF', '#FF83F7', '#CB59F8', '#B03AFF']}
            style={[styles.taskContainer, { borderColor: getBorderColour() }]}
        >
            <View style={{flexDirection: 'row', justifyContent: 'space-between',}}>
                <Text
                    onPress={onTaskPressed}
                    style={[styles.taskTitle, {
                        textDecorationLine: task.isCompleted
                        ? 'line-through'
                        : 'none',
                        // color: task.isCompleted
                        // ? '#00CC44'
                        // : 'black',
                        color: 'black'
                    }]}
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
                        // task.isCompleted
                        // ? '#00CC44'
                        // : 'black'
                        'black'
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
        borderWidth: 1,
        borderRadius: 17,
    },
    taskTitle: {
        fontSize: 17,
        fontWeight: '400'
    }
})

export default TaskListItem;