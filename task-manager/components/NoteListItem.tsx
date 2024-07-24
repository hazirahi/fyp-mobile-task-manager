import { NoteMod } from "@/provider/TaskListProvider";
import { Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { supabase } from "@/config/initSupabase";
import { useEffect, useState } from "react";

type NoteListItem = {
    note: NoteMod;
}

const NoteListItem = ({note}: NoteListItem) => {
    // console.log(note.modules)
    const noteModule = Array.isArray(note.modules) ? note.modules : [note.modules];
    return (
        <View>
            <TouchableOpacity style={styles.container}>
                <Text style={styles.text}>{note.note_title}</Text>
                <Text numberOfLines={6}>{note.note_text}</Text>
                {noteModule.map((module) => (
                    module && (
                        <View key={module.id} style={{position: 'absolute', bottom: 15, right: 20}}>
                            <Text style={styles.module}>{module.module_title}</Text>
                        </View>
                    )
                ))}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        width: 160,
        height: 200,
        // justifyContent: 'center',
        backgroundColor: 'lightgray',
        paddingVertical: 20,
        paddingHorizontal: 20
    },
    text: { 
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white',
        paddingBottom: 5
    },
    module: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'white'
    }
})

export default NoteListItem;