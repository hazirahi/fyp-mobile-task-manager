import { View, Text, StyleSheet } from "react-native";

import { TaskCat } from "@/types/types";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Swipeable } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { Circle, Svg, Symbol, Use } from "react-native-svg";
import { Text as SvgText } from "react-native-svg";

const RightActions = ({onDelete} : {onDelete: () => void;}) => {
    return (
        <View
            style={{
                alignItems: 'center',
                flexDirection: 'row',
                //paddingLeft: 5,
                gap: 15,
                paddingRight: 20
            }}
        >
            <MaterialIcons name="mode-edit" size={24} color="black" />
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

    const getPrioritySymbol = () => {
        switch (task.priority_id) {
            //low
            case 1:
                return (
                    <Svg height="40" width="45">
                        <Symbol id="symbol" viewBox="0 0 80 90">
                            <Circle cx='0' cy='0' r='40' fill='#FFE100' />
                            <Circle cx='30' cy='20' r='25' fill='#FFE100' />
                        </Symbol>
                        <Use href="#symbol" x={0} y={20} width={75} height={38}/>
                        <SvgText
                            x={20}
                            y={21}
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fontWeight={'900'}
                            fontSize={16}
                            fill={'white'}
                        >!</SvgText>
                    </Svg>
                )
            // medium
            case 2:
                return (
                    <Svg height="40" width="45">
                        <Symbol id="symbol" viewBox="0 0 80 90">
                            <Circle cx='0' cy='0' r='40' fill='#FF9500' />
                            <Circle cx='30' cy='20' r='25' fill='#FF9500' />
                        </Symbol>
                        <Use href="#symbol" x={0} y={20} width={75} height={38}/>
                        <SvgText
                            x={20}
                            y={21}
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fontWeight={'900'}
                            fontSize={16}
                            fill={'white'}
                        >!!</SvgText>
                    </Svg>
                )
            // high
            case 3:
                return (
                    <Svg height="40" width="45">
                        <Symbol id="symbol" viewBox="0 0 80 90">
                            <Circle cx='0' cy='0' r='40' fill='#F40000' />
                            <Circle cx='30' cy='20' r='25' fill='#F40000' />
                        </Symbol>
                        <Use href="#symbol" x={0} y={20} width={75} height={38}/>
                        <SvgText
                            x={20}
                            y={21}
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fontWeight={'900'}
                            fontSize={16}
                            fill={'white'}
                        >!!!</SvgText>
                    </Svg>
                )
            default:
                return null;
        }
    }

    return (
        <>
        <Swipeable
            renderRightActions={() => (
                <RightActions onDelete={onDelete}/>
            )}
        >
            
        {/* <LinearGradient
            colors={getGradientColours()}
            // colors={['#FFFFFF', '#F6FF78', '#D5FF61', '#A6F511']}
            // colors={['#FFFFFF', '#FF83F7', '#CB59F8', '#B03AFF']}
            style={[styles.taskContainer, { borderColor: getBorderColour() }]}
        > */}
        
        <View style={{paddingHorizontal: 20, paddingTop: 15}}>
            
        
            <View style={[{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', borderColor: getBorderColour()}, styles.taskContainer]}>
            
                <Text
                    onPress={onTaskPressed}
                    style={[styles.taskTitle, {
                        textDecorationLine: task.isCompleted
                        ? 'line-through'
                        : 'none',
                        // color: task.isCompleted
                        // ? '#00CC44'
                        // : 'black',
                        color: getBorderColour()
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
                        getBorderColour()
                    }
                    
                />
            </View>
            <View style={styles.symbol}>
            {getPrioritySymbol()}
            </View>
            </View>  
            {/* </LinearGradient> */}
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
        bottom: 10
    }
})

export default TaskListItem;