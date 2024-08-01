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
        <View>
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
        </View>
    )
}