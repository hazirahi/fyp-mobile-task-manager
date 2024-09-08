import { forwardRef, useImperativeHandle, useRef, useState, useMemo, useCallback } from "react";
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from "react-native";

import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";

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

    const snapPoints = useMemo(() => ['50%', '80%'], []);
    const renderBackdrop = useCallback(
        (props:any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []
    );

    return (
        <BottomSheetModal
            ref={innerRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            enableDismissOnClose
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{backgroundColor: '#302F33'}}
            backgroundStyle={{backgroundColor: '#8CDCF9'}}
        >
            <View style={styles.container}>
                <Text style={{fontSize: 23, fontWeight: '700', paddingBottom: 15}}>What do you want to focus on?</Text>
                <FlatList
                    style={styles.taskContainer}
                    scrollEnabled={true}
                    contentContainerStyle={{gap: 15}}
                    data={tasks}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={({ item: task }) => (
                        <View style={{backgroundColor: '#4DC6F9', borderRadius: 12, padding: 15, paddingVertical: 13}}>
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
        backgroundColor: '#77D6F8',
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#16B4F8',
    }
})

export default FocusTaskBottomSheet;