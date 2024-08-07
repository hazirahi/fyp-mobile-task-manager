import { useAuth } from "@/provider/AuthProvider";
import { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";

import { NoteMod, Note } from "@/types/types";
import { useTaskList } from "@/provider/TaskListProvider";
import { supabase } from "@/config/initSupabase";
import NoteListItem from "./NoteListItem";

export default function NoteList() {
    const { user } = useAuth();
    const { notes, getNotes } = useTaskList();

    useEffect(() => {
        if (!user) return;

        getNotes();
    }, [user]);

    
    return(
        <View style={{paddingHorizontal: 20}}>
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
                    columnWrapperStyle={{justifyContent: 'space-evenly'}}
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