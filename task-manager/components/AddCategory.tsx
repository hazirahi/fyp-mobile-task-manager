import { forwardRef, useImperativeHandle, useRef, useState, useMemo, useCallback } from "react";
import { View , StyleSheet} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { useTaskList } from "@/provider/TaskListProvider";
import { Category, Module } from "@/types/types";

import { BottomSheetModal, BottomSheetBackdrop, BottomSheetTextInput } from "@gorhom/bottom-sheet";

type Ref = BottomSheetModal;

export type AddCategory = {
    moduleId: number;
    onAdd: (
        category_name: Category['category_name'],
        module_id: Module['id']
    ) => void;
}

const AddCategory = forwardRef<Ref, AddCategory>((props, ref) => {
    const innerRef = useRef<Ref>(null);

    useImperativeHandle<Ref|null, Ref|null>(
        ref,
        () => innerRef.current
    );

    const snapPoints = useMemo(() => ['20%', '30%'], []);
    const renderBackdrop = useCallback(
        (props:any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []
    );

    const { addCategory } = useTaskList();
    const [newCategory, setNewCategory] = useState('');

    const addNewCat = () => {
        console.log('(ADDCATEGORY) adding new cat: ', newCategory, props.moduleId)
        addCategory(newCategory, props.moduleId);
        setNewCategory('');
        innerRef.current?.close();
    }

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
                <BottomSheetTextInput 
                    style={styles.header}
                    placeholder="add category"
                    placeholderTextColor={'lightgray'}
                    onChangeText={(text) => setNewCategory(text)}
                    value={newCategory}
                />
                <View>
                    <MaterialCommunityIcons
                        name="checkbox-marked-circle"
                        onPress={addNewCat}
                        size={40}
                        color={'#0084FF'}
                    />
                </View>
            </View>
        </BottomSheetModal>
    )
})

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 30
    },
    header: {
        fontWeight: 'bold',
        fontSize: 30
    },
})

export default AddCategory;