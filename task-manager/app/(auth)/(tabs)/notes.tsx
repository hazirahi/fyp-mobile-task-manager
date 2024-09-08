import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import AddNoteBottomSheet from "@/components/AddNoteBottomSheet";
import NoteList from "@/components/NoteList";
import { useAuth } from "@/provider/AuthProvider";
import { useTaskList } from "@/provider/TaskListProvider";

import { BottomSheetModal } from "@gorhom/bottom-sheet";

export default function Notes() {
    const { user } = useAuth();
    const { getNotes, getModule } = useTaskList();

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const handleOpenPress = () => bottomSheetRef.current?.present();

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
        paddingBottom: 20,
        fontFamily: 'EBGaramond'
    },
    addNoteBTN: {
        position: 'absolute',
        bottom: 10,
        right: 2
    }
});