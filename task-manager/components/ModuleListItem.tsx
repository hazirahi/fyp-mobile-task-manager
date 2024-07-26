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
                <View style={{position: 'absolute', bottom: 15, alignSelf: 'center'}}>
                    <Text style={styles.text}>
                        {module.module_title}
                    </Text>
                </View> 
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 20,
        width: 120,
        height: 120,
        justifyContent: 'center'
    },
    text: { 
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 17,
        color: 'black'
    },
})

export default ModuleListItem;