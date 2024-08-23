import { Text, View , StyleSheet} from "react-native";
import { useTaskList } from "@/provider/TaskListProvider";
import { forwardRef, useImperativeHandle, useRef, useState, useMemo, useCallback } from "react";
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { Category, Module } from "@/types/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// adds category to all modules atm, not sure if i want to make it so that only add the category to current module :/

// export default function AddCategory() {
//     const { addCategory } = useTaskList();

//     const [newCatName, setNewCatName] = useState('');
    
//     const addNewCat = () => {
//         addCategory(newCatName);
//         console.log(newCatName);
//     }

//     const handleSavePress = () => {
//         if (router.canGoBack()) {
//             router.back();
//         }
//         else {
//             router.push('/home');
//         }
//     }

//     return (
//         <SafeAreaView style={{flex: 1}}>
//             <View style={{paddingHorizontal: 20}}>
//                 <View>
//                     <TextInput
//                         style={styles.header}
//                         placeholder="Category name"
//                         placeholderTextColor={'gray'}
//                         onChangeText={(text) => setNewCatName(text)}
//                         value={newCatName}
//                     />
//                 </View>
//             </View> 
//             <View style={{flexDirection: 'row',justifyContent: 'space-between', position: 'absolute', bottom: 50, right: 30}}>
//                 <View>
//                     <TouchableOpacity onPress={handleSavePress} style={{backgroundColor: 'lightblue', borderRadius: 20, padding: 10, alignItems: 'center'}}>
//                         <Text>go back</Text>
//                     </TouchableOpacity>
//                 </View>
//                 <View>
//                     <TouchableOpacity 
//                         onPress={()=>{
//                             addNewCat();
//                             router.back()
                            
//                         }} style={{backgroundColor: 'lightgreen', borderRadius: 20, padding: 10, alignItems: 'center'}}>
//                         <Text>add category</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </SafeAreaView>
//     )

// }

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

    const { categories, addCategory } = useTaskList();
    const [newCategory, setNewCategory] = useState('');
    //const [moduleId, setModuleId] = useState<number>(0);

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
        //flex: 1,
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