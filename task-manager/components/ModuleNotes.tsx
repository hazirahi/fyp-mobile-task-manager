import { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";

import { useLocalSearchParams } from "expo-router";

import { NoteMod, Note } from "@/types/types";
import { supabase } from "@/config/initSupabase";
import { useAuth } from "@/provider/AuthProvider";

import NoteListItem from "./NoteListItem";


export default function ModuleNotes() {
    const { user } = useAuth();
    const { id } = useLocalSearchParams();

    console.log(id, 'modulenotes')

    const [notes, setNotes] = useState<NoteMod[]>([]);

    useEffect(() => {
        if (!user) return;

        getModuleNotes();
    }, [user, id]);

    const getModuleNotes = async () => {
        const {data: notes, error} = await supabase
            .from('notes')
            .select('*, modules(*)')
            .eq('module_id', id)
        if (error)
            console.log(error.message)
        else
            setNotes(notes!);
    }

    return(
        <View style={{paddingHorizontal: 20, paddingTop: 10}}>
            {notes.length === 0 ? (
                <View style={{ borderWidth: 1, borderRadius: 20, padding: 40, height: '90%'}}>
                    <Text style={{textAlign: 'center', top: '40%', fontSize: 17, fontWeight: '500'}}>
                        You haven't created any notes yet! Tap the + icon to add a new note.
                    </Text>
                </View>
            ) : (
                <FlatList
                    scrollEnabled={true}
                    data={notes}
                    keyExtractor={(item) => `${item.id}`}
                    contentContainerStyle={{gap:15}}
                    columnWrapperStyle={{justifyContent: 'space-between'}}
                    renderItem={({ item: note }) => (
                    <NoteListItem
                            note={note}
                    />
                    )}
                    numColumns={2}
                />
            )}
            
        </View>
    )
}