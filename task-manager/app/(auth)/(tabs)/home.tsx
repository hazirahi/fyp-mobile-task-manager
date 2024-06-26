import TaskList from "@/components/TaskList";
import { View, Text, Alert, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home (){
    return (
        <GestureHandlerRootView>
            <SafeAreaView style={styles.container}>
                <View>
                    <TaskList/>
                </View>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 25
    },
})