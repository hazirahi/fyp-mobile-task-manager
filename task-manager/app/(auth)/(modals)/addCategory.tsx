import { Text, View , StyleSheet} from "react-native";
import { TouchableOpacity, TextInput } from "react-native-gesture-handler";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTaskList } from "@/provider/TaskListProvider";
import { useState } from "react";

// adds category to all modules atm, not sure if i want to make it so that only add the category to current module :/

export default function AddCategory() {
    const { addCategory } = useTaskList();

    const [newCatName, setNewCatName] = useState('');
    
    const addNewCat = () => {
        addCategory(newCatName);
        console.log(newCatName);
    }

    const handleSavePress = () => {
        if (router.canGoBack()) {
            router.back();
        }
        else {
            router.push('(tabs)/home');
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{paddingHorizontal: 20}}>
                <View>
                    <TextInput
                        style={styles.header}
                        placeholder="Category name"
                        placeholderTextColor={'gray'}
                        onChangeText={(text) => setNewCatName(text)}
                        value={newCatName}
                    />
                </View>
            </View> 
            <View style={{flexDirection: 'row',justifyContent: 'space-between', position: 'absolute', bottom: 50, right: 30}}>
                <View>
                    <TouchableOpacity onPress={handleSavePress} style={{backgroundColor: 'lightblue', borderRadius: 20, padding: 10, alignItems: 'center'}}>
                        <Text>go back</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity 
                        onPress={()=>{
                            addNewCat();
                            router.back()
                            
                        }} style={{backgroundColor: 'lightgreen', borderRadius: 20, padding: 10, alignItems: 'center'}}>
                        <Text>add category</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    header: {
        fontWeight: 'bold',
        fontSize: 30,
        paddingTop: 20,
        paddingBottom: 5
    },
})