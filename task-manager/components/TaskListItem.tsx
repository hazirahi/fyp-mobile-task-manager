import { View, Text, StyleSheet } from "react-native";

import { TaskCat } from "@/types/types";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Swipeable } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { Circle, Svg, Symbol, Use } from "react-native-svg";
import { Text as SvgText } from "react-native-svg";
import { ReactNode } from "react";
import { router } from "expo-router";

const RightActions = ({onDelete, onEdit} : {onDelete: () => void; onEdit: () => void;}) => {
    return (
        <View
            style={{
                alignItems: 'center',
                flexDirection: 'row',
                //paddingLeft: 5,
                gap: 15,
                paddingRight: 20,
                paddingTop: 20
            }}
        >
            <MaterialIcons
                onPress={onEdit}
                name="mode-edit" 
                size={24}
                color="black"
            />
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
    onEdit: () => void;
    onTaskPressed: () => void;
    prioritySymbol: ReactNode | null;
}

const TaskListItem = ({task, onCheckPressed, onDelete, onEdit, onTaskPressed, prioritySymbol}: TaskListItem) => {
    // const getBorderColour = () => {
    //     switch (task.priority_id) {
    //         // low
    //         case 1:
    //             return '#FFBB00';
    //         // medium
    //         case 2:
    //             return '#FF8800';
    //         // high
    //         case 3:
    //             return '#E51F1F';
    //         // default
    //         default:
    //             return 'black';
    //     }  
    // }

    // const getGradientColours = () => {
    //     switch (task.priority_id) {
    //         // low
    //         case 1:
    //             // return ['#FFFFFF', '#FFF478', '#FFEE35', '#FFE100'];
    //             return '#FFE100';
    //         // medium
    //         case 2:
    //             // return ['#FFFFFF', '#FFBE56', '#FFBE56', '#FF9500'];
    //             return '#FF9500';
    //         // high
    //         case 3:
    //             // return ['#FFFFFF', '#FF859F', '#FF6171', '#F40000'];
    //             return '#F40000';
    //         // default
    //         default:
    //             // return ['#FFFFFF', '#F6FF78', '#D5FF61', '#A6F511'];
    //             return 'white';
    //     }
    // }

    const handleEditPress = () => {
        console.log(task.id);
        router.navigate({ pathname: '/(auth)/(modals)/editNote', params: {taskId: task.id }});
    };

    return (
        <>
        <Swipeable
            renderRightActions={() => (
                <RightActions onDelete={onDelete} onEdit={onEdit}/>
            )}
        >
            <View style={{paddingHorizontal: 20, paddingTop: 20}}>
        <LinearGradient
            //colors={getGradientColours()}
            // colors={['#FFFFFF', '#F6FF78', '#D5FF61', '#A6F511']}
            // colors={['#FFFFFF', '#FF83F7', '#CB59F8', '#B03AFF']}
            colors={['#FFFFFF', '#8CDCF9']}
            style={[styles.taskContainer, { borderColor: '#0084FF', flexDirection: 'row', justifyContent: 'space-between' }]}
        >
        
        {/* <View style={{paddingHorizontal: 20, paddingTop: 20}}> */}
            
        
            {/* <View style={[{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', borderColor: getBorderColour()}, styles.taskContainer]}>
             */}
                <Text
                    onPress={onTaskPressed}
                    style={[styles.taskTitle, {
                        textDecorationLine: task.isCompleted
                        ? 'line-through'
                        : 'none',
                        color: task.isCompleted
                        ? '#0084FF'
                        : 'black',
                        // color: 'black'
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
                        '#0084FF'
                    }
                    
                />
                
            {/* </View> */}
                    
            {/* </View>   */}
            </LinearGradient>
            {prioritySymbol}
            </View>
        </Swipeable>
        
        </>
    );
};

const styles = StyleSheet.create({
    taskContainer: {
        padding:15,
        paddingVertical: 17,
        borderWidth: 1,
        borderRadius: 17
    },
    taskTitle: {
        fontSize: 17,
        fontWeight: '400'
    },
    symbol: { 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 20
    }
})

export default TaskListItem;