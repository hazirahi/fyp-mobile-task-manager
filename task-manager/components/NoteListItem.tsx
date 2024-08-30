import { NoteMod } from "@/types/types";
import { Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import { useState } from "react";
import EditNote from "@/app/(auth)/(modals)/editNote";

type NoteListItem = {
    note: NoteMod;
}

const NoteListItem = ({note}: NoteListItem) => {
    const noteModule = Array.isArray(note.modules) ? note.modules : [note.modules];

    return (
        <View>
            <LinearGradient
                colors={['#FFFFFF', '#F6FF78', '#D5FF61']}
                style={{borderRadius: 20, borderWidth: 1}}
            >
            <TouchableOpacity style={styles.container} onPress={() => router.navigate({pathname: '/editNote', params: {noteId: note.id}})}>
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
        width: 167,
        height: 200,
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    text: { 
        textAlign: 'left',
        fontWeight: '600',
        fontSize: 17,
        color: 'black',
        paddingBottom: 5
    },
    module: {
        fontWeight: '600',
        fontSize: 16,
        color: '#80DA39'
    }
})

export default NoteListItem;