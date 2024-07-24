import NoteList from "@/components/NoteList";
import { supabase } from "@/config/initSupabase";
import { useAuth } from "@/provider/AuthProvider";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notes() {
    

    return(
        <SafeAreaView style={styles.container}>
            <View>
                <Text style={styles.header}>Notes</Text>
            </View>
            <View style={styles.noteContainer}>
                <NoteList/>
            </View>
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
    noteContainer: {
       
    }
});