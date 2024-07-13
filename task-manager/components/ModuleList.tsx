import { Text, StyleSheet, View, Modal, Alert } from "react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";

import { useTaskList } from "@/provider/TaskListProvider";
import ModuleListItem from "./ModuleListItem";

import { MaterialIcons } from '@expo/vector-icons';

import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ModuleList () {
    const { modules } = useTaskList();

    const addNewModule = () => {
        console.log('add module pressed');
    }
    
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Modules</Text>
            <FlatList
                scrollEnabled={true}
                horizontal={true}
                contentContainerStyle={{gap: 15}}
                data={modules}
                keyExtractor={(item) => `${item.id}`}
                renderItem={({item: module}) => (
                    <ModuleListItem
                        module={module}
                    />
                )}
                ListFooterComponent={
                    <View>
                        <TouchableOpacity
                            style={styles.addContainer}
                            onPress={()=>router.navigate('(modals)/addModule')}
                        >
                            <MaterialIcons name="add" size={65} color="lightgray" style={{alignSelf: 'center'}} />
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // padding: 20,
        // paddingVertical: 30,
        // borderRadius: 20,
        // backgroundColor: 'lightgray'
    },
    header: {
        fontWeight: 'bold',
        fontSize: 23,
        paddingTop: 20,
        paddingBottom: 15
    },
    addContainer: {
        borderRadius: 20,
        width: 120,
        height: 120,
        justifyContent: 'center',
        backgroundColor: 'gray'
    }
})