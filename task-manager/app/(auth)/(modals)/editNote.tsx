import { supabase } from "@/config/initSupabase";
import { useAuth } from "@/provider/AuthProvider";
import { useTaskList } from "@/provider/TaskListProvider";
import { NoteMod } from "@/types/types";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons, FontAwesome6 } from '@expo/vector-icons';


import { LinearGradient } from 'expo-linear-gradient';



const EditNote = () => {
    const { noteId } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();
    const { notes } = useTaskList();
    
    const [noteTitle, setNoteTitle] = useState('');
    const [noteText, setNoteText] = useState('');
    const [noteList, setNoteList] = useState<NoteMod[]>([]);

    useEffect(() => {
        noteId&&getNoteInfo();
    }, [noteId]);

    const getNoteInfo = async () => {
        const { data: notes, error } = await supabase
            .from('notes')
            .select('*')
            .eq('id', noteId)
            .single()
        if (error)
            console.log(error.message)
        else {
            setNoteTitle(notes.note_title);
            setNoteText(notes.note_text);
        }
    }

    async function updateNote({
        noteTitle,
        noteText
    } : {
        noteTitle: string
        noteText: string
    }) {
        try {
            setLoading(true);
            if (!user)
                throw new Error('no user on session')
            const updates = {
                user_id: user.id,
                id: noteId,
                note_title: noteTitle,
                note_text: noteText
            }

            console.log('notes: ', updates)

            const { error } = await supabase
                .from('notes')
                .upsert(updates)
            if (error)
                throw error
        } catch (error) {
            if (error instanceof Error)
                alert(error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView keyboardShouldPersistTaps='handled'>
                <LinearGradient 
                    colors={['#0084FF','#16B4F8', '#8CDCF9', '#FFFFFF', '#8CDCF9', '#16B4F8', '#0084FF']}
                    style={styles.background}
                />
                <View style={{paddingHorizontal: 15}}>
                    <TouchableOpacity onPress={() => router.navigate('/notes')}>
                        <Ionicons name="chevron-back" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={{paddingHorizontal: 20, paddingTop: 10}}>
                    <View>
                        <TextInput
                            style={styles.title}
                            value={noteTitle || ''}
                            onChangeText={(text) => setNoteTitle(text)}
                            multiline={true}
                            // onEndEditing={() => updateNote({noteTitle, noteText})}
                        />
                        <TextInput
                            style={styles.content}
                            value={noteText || ''}
                            onChangeText={(text) => setNoteText(text)}
                            multiline={true}
                            // onEndEditing={() => updateNote({noteTitle, noteText})}
                        />
                    </View>
                </View>
                
            </ScrollView>
            <View style={styles.btnContainer}>
                <View>
                    <TouchableOpacity>
                        <FontAwesome6 name="paperclip" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                    style={styles.updateBTN}
                    onPress={() => {
                        updateNote({noteTitle, noteText});
                        router.navigate('/notes')
                    }}
                >
                    <Text style={{fontSize: 15, fontWeight: '600'}}>Done</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#0084FF'
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 750
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        color: 'black'
    },
    content: {
        fontSize: 17,
        paddingTop: 15
    },
    btnContainer: {
        position: 'absolute',
        bottom: 50,
        // right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 230,
        paddingHorizontal: 20
    },
    updateBTN: {
        backgroundColor: '#0084FF',
        padding: 10,
        borderRadius: 20,
        width: 100,
        alignItems: 'center',
        borderWidth: 1
    }
})

export default EditNote;