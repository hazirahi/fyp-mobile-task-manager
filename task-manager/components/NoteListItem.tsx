import { NoteMod } from "@/provider/TaskListProvider";
import { Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

type NoteListItem = {
    note: NoteMod;
}

const NoteListItem = ({note}: NoteListItem) => {
    // console.log(note.modules)
    const noteModule = Array.isArray(note.modules) ? note.modules : [note.modules];
    return (
        <View>
            <LinearGradient
                colors={['#FFFFFF', '#8CDCF9', '#16B4F8', '#0084FF']}
                style={{borderRadius: 20, borderWidth: 1}}
            >
            <TouchableOpacity style={styles.container} onPress={()=>router.navigate('/(modals)/editNote')}>
                <Text style={styles.text}>{note.note_title}</Text>
                <Text numberOfLines={6} style={{fontWeight: '400'}}>{note.note_text}</Text>
                {noteModule.map((module) => (
                    module && (
                        <View key={module.id} style={{position: 'absolute', bottom: 15, right: 20}}>
                            <Text style={styles.module}>{module.module_title}</Text>
                        </View>
                    )
                ))}
            </TouchableOpacity>
            </LinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 170,
        height: 200,
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    text: { 
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: 16,
        color: '#0084FF',
        paddingBottom: 5
    },
    module: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white'
    }
})

export default NoteListItem;