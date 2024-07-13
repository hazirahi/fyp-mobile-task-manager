import { View, Text, StyleSheet } from "react-native";
import { Module } from "@/provider/TaskListProvider";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";

type ModuleListItem = {
    module: Module;
}

const ModuleListItem = ({module}: ModuleListItem) => {

    return (
        <View>
            <TouchableOpacity
                style={[{backgroundColor: module.colour}, styles.container]}
                onPress={()=>router.navigate({pathname: '[id]', params:{id: module.id}})}
            >
                <Text style={styles.text}>
                    {module.module_title}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        width: 120,
        height: 120,
        justifyContent: 'center',
    },
    text: { 
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white'
    },
})

export default ModuleListItem;