import { View, Text, StyleSheet } from 'react-native';
import { forwardRef, useRef, useMemo, useCallback, useImperativeHandle, useState, useEffect } from 'react';

import BottomSheet, { BottomSheetBackdrop, BottomSheetTextInput, TouchableOpacity } from '@gorhom/bottom-sheet';
import { Note } from '@/types/types';
import { useTaskList } from '@/provider/TaskListProvider';
import { Dropdown } from 'react-native-element-dropdown';

export type Ref = BottomSheet;

export type AddNote = {
    onAdd: (
        newNote: {
            note_title: Note['note_title'],
            note_text: Note['note_text'],
            module_id: Note['module_id']
        }
    ) => void;
}

const AddNoteBottomSheet = forwardRef<Ref, AddNote>(({onAdd}: AddNote, ref) => {
    const innerRef = useRef<Ref>(null);

    useImperativeHandle<Ref|null, Ref|null>(
        ref,
        () => innerRef.current
    );

    const snapPoints = useMemo(() => ['70%', '80%'], []);
    const renderBackdrop = useCallback(
        (props:any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []
    );

    const { notes, modules, addNote } = useTaskList();

    const [newNoteTitle, setNewNoteTitle] = useState('');
    const [newNoteContent, setNewNoteContent] = useState('');
    const [noteModule, setNoteModule] = useState<number>(0);

    const [noteList, setNoteList] = useState<Note[]>([]);

    useEffect(() => {
        // console.log('addnotebs notelist: ', noteList)
    }, [noteList]);

    const addNewNote = () => {
        onAdd({
            note_title: newNoteTitle,
            note_text: newNoteContent,
            module_id: noteModule
        });
        console.log(newNoteTitle, newNoteContent, noteModule);

        addNote(
            newNoteTitle, newNoteContent, noteModule
        )

        setNewNoteTitle('');
        setNewNoteContent('');
        setNoteModule(0);
        innerRef.current?.close();
    }

    return (
        <BottomSheet
            ref={innerRef}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{backgroundColor: '#302F33'}}
            backgroundStyle={{backgroundColor: 'white'}}
            keyboardBehavior='fillParent'
        >
            <View style={{flex:1, paddingHorizontal: 20}}>
                <BottomSheetTextInput
                    style={styles.title}
                    placeholder='note title'
                    onChangeText={(text) => setNewNoteTitle(text)}
                    value={newNoteTitle}
                    multiline= {true}
                />
                <View>
                    <Dropdown
                        style={styles.dropdown}
                        data={modules}
                        labelField='module_title'
                        valueField='id'
                        placeholder='Module'
                        onChange={item => {
                            setNoteModule(item.id);
                        }}
                    />
                </View>
                <BottomSheetTextInput
                    style={styles.content}
                    placeholder='add something here...'
                    onChangeText={(text) => setNewNoteContent(text)}
                    value={newNoteContent}
                    multiline= {true}
                />
                
            </View>
            <View style={{padding: 20}}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        addNewNote();
                        
                    }}
                >
                    <Text style={{padding: 10, paddingHorizontal: 25, color: 'white'}}>Add Note</Text>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    )

})

const styles = StyleSheet.create({
    title: {
        paddingTop: 40,
        fontSize: 35,
        fontWeight: '600',
        color: 'black',
        paddingBottom: 10
    },
    content: {
        fontSize: 18,
        paddingTop: 20
    },
    dropdown: {
        backgroundColor: '#8CDCF9',
        padding: 5,
        borderRadius: 20,
        width: '30%',
        paddingLeft: 15,
        borderWidth: 1,
        borderColor: '#0084FF'
    },
    addButton: {
        alignSelf: 'center',
        backgroundColor: '#0084FF',
        borderRadius: 20
    },
});

export default AddNoteBottomSheet;