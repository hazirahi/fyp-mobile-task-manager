import AddNoteBottomSheet from "@/components/AddNoteBottomSheet";
import NoteList from "@/components/NoteList";
import { supabase } from "@/config/initSupabase";
import { useAuth } from "@/provider/AuthProvider";
import { Note, useTaskList } from "@/provider/TaskListProvider";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notes() {
    const { user } = useAuth();

    const bottomSheetRef = useRef<BottomSheet>(null);
    const handleOpenPress = () => bottomSheetRef.current?.expand();

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
            <View>
                <Text style={styles.header}>Notes</Text>
            </View>
            <View>
                <NoteList/>
            </View>
            <Ionicons name='add-circle' size={80} color={'lightblue'} onPress={handleOpenPress} style={styles.addNoteBTN} />
            <AddNoteBottomSheet
                ref={bottomSheetRef}
                onAdd={(newNote) =>
                    setNoteList(notes => [...notes, {
                        id: generateNoteId(),
                        user_id: user!.id,
                        note_title: newNote.note_title,
                        note_text: newNote.note_text,
                        module_id: newNote.module_id
                    }])
                }
            />
        </SafeAreaView>
    )
    
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        paddingHorizontal: 20
    },
    header: {
        fontWeight: 'bold',
        fontSize: 30,
        paddingTop: 20,
        paddingBottom: 20
    },
    addNoteBTN: {
        position: 'absolute',
        bottom: 10,
        right: 2
    }
});