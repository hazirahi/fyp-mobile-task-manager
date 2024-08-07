import AddNoteBottomSheet from "@/components/AddNoteBottomSheet";
import NoteList from "@/components/NoteList";
import { supabase } from "@/config/initSupabase";
import { useAuth } from "@/provider/AuthProvider";
import { Note } from "@/types/types";
import { useTaskList } from "@/provider/TaskListProvider";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function Notes() {
    const { user } = useAuth();

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const handleOpenPress = () => bottomSheetRef.current?.present();

    const [noteList, setNoteList] = useState<Note[]>([]);
    const { getNotes, getModule } = useTaskList();

    let noteIdCounter = 0;

    const generateNoteId = () => {
        return ++noteIdCounter;
    }

    useEffect(() => {
        if (!user) return;

        getModule();
        getNotes();
    }, [user]);

    return(
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#A6F511', '#D5FF61', '#F6FF78', '#FFFFFF']}
                style={styles.background}
            />
            <View style={{paddingHorizontal: 20}}>
                <Text style={styles.header}>Notes</Text>
            </View>
            <View>
                <NoteList/>
            </View>
            <Ionicons name='add-circle' size={80} color={'#0084FF'} onPress={handleOpenPress} style={styles.addNoteBTN} />
            <AddNoteBottomSheet
                ref={bottomSheetRef}
                onAdd={(newNote) => {
                    setNoteList(notes => [...notes, {
                        id: generateNoteId(),
                        user_id: user!.id,
                        note_title: newNote.note_title,
                        note_text: newNote.note_text,
                        module_id: newNote.module_id
                    }])
                    bottomSheetRef.current?.close();
                }}
            />
        </SafeAreaView>
    )
    
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'white'
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 730
    },
    header: {
        fontSize: 50,
        fontWeight: '600',
        //paddingTop: 10,
        paddingBottom: 20,
        fontFamily: 'EBGaramond'
    },
    addNoteBTN: {
        position: 'absolute',
        bottom: 10,
        right: 2
    }
});