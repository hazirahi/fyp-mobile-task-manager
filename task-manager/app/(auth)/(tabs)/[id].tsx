import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useLocalSearchParams } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';

import { useTaskList } from "@/provider/TaskListProvider";


const ModuleDetail = () => {
    const { id } = useLocalSearchParams();

    const { modules, getModule } = useTaskList();

    useEffect (() => {
        getModule();
    })

    const module = modules.find((m) => m.id.toString() == id);

    return (
        <SafeAreaView style={{paddingHorizontal: 20}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View>
                    <Text style={styles.header}>{module?.module_title}</Text>
                    <Text>{module?.module_description}</Text>
                </View>
                <TouchableOpacity>
                    <FontAwesome name="circle" size={70} color={module?.colour} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create ({
    header: {
        fontWeight: 'bold',
        fontSize: 30,
        paddingTop: 20,
        paddingBottom: 5
    },
})

export default ModuleDetail;