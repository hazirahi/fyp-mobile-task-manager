import { router } from "expo-router";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";


export default function EditNote() {
    return (
        <SafeAreaView>
            <View>
                <Text>edit note</Text>
                <TouchableOpacity onPress={() => router.navigate('/(tabs)/notes')}>
                    <Text>go back</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )

}