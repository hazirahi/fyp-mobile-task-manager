import { forwardRef, useImperativeHandle, useRef, useState, useMemo, useCallback } from "react";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import TaskListItem from "./TaskListItem";
import { useTaskList } from "@/provider/TaskListProvider";


type Ref = BottomSheetModal;

type FocusTask = {
    onTaskSelect: (taskName: string, taskId: number) => void;
}

const FocusTaskBottomSheet = forwardRef<Ref, FocusTask>((props, ref) => {
    const { tasks } = useTaskList();
    const { onTaskSelect } = props;

    const innerRef = useRef<Ref>(null);

    useImperativeHandle<Ref|null, Ref|null>(
        ref,
        () => innerRef.current
    );

    const snapPoints = useMemo(() => ['50%', '60%'], []);
    const renderBackdrop = useCallback(
        (props:any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []
    );

    return (
        <BottomSheetModal
            ref={innerRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{backgroundColor: '#302F33'}}
            backgroundStyle={{backgroundColor: 'white'}}
        >
            <View style={styles.container}>
                <Text style={{fontSize: 23, fontWeight: '700', paddingBottom: 10}}>Choose a task to focus on:</Text>
                <FlatList
                    style={styles.taskContainer}
                    scrollEnabled={true}
                    contentContainerStyle={{gap: 15}}
                    data={tasks}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={({ item: task }) => (
                        <View>
                            <TouchableOpacity
                                onPress={() => onTaskSelect(task.task_name, task.id)}
                            >
                                <Text style={{fontSize: 16, fontWeight: '500'}}>{task.task_name}</Text>
                            </TouchableOpacity>     
                        </View>
                    )}
                />
            </View>
        </BottomSheetModal>
    )
})

const styles = StyleSheet.create({ 
    container: {
        paddingHorizontal: 20,
        paddingTop: 30
    },
    taskContainer: {
        backgroundColor: '#8CDCF9',
        paddingVertical: 30,
        paddingHorizontal: 20,
        borderRadius: 20
    }
})

export default FocusTaskBottomSheet;