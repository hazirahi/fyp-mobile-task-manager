import { useState } from "react";
import { SafeAreaView, Text, StyleSheet, View, Modal } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import ColorPicker, { colorKit, HueCircular, InputWidget, Panel1, returnedResults, Swatches } from "reanimated-color-picker";

import { router } from "expo-router";
import { FontAwesome } from '@expo/vector-icons';

import { useTaskList } from "@/provider/TaskListProvider";

export default function AddModule() {

    const [showModal, setShowModal] = useState(false);
    const [colour, setColour] = useState('');

    const customSwatches = new Array(6).fill('#fff').map(() => colorKit.randomRgbColor().hex());

    const selectedColour = useSharedValue(customSwatches[0]);

    const onColourSelect = (color: returnedResults) => {
        'worklet';
        selectedColour.value = color.hex
    };
    const { addModule } = useTaskList();

    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [newModuleDesc, setNewModuleDesc] = useState('');

    const addNewModule = () => {
        addModule(
            newModuleTitle,
            newModuleDesc,
            colour
        )
        console.log(newModuleTitle, newModuleDesc, colour);
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={{paddingHorizontal: 20}}>
                <TouchableOpacity onPress={()=> setShowModal(true)}>
                    <FontAwesome name="circle" size={70} color={selectedColour.value} />
                </TouchableOpacity>
                <Modal onRequestClose={() => {setColour(selectedColour.value); setShowModal(false);}} visible={showModal} animationType="slide" transparent={true}>
                    <View style={styles.container}>
                        <View style={styles.pickerContainer}>
                            <ColorPicker value={selectedColour.value} sliderThickness={20} thumbSize={24} onChange={onColourSelect} boundedThumb>
                                <HueCircular containerStyle={styles.hueContainer} thumbShape="pill">
                                    <Panel1 style={styles.panelStyle} />
                                </HueCircular>
                                <View>
                                    <Swatches style={styles.swatchesContainer} swatchStyle={styles.swatchStyle} colors={customSwatches} /> 
                                    <InputWidget inputStyle={{ paddingVertical: 10, borderColor: '#707070', fontSize: 15,  borderRadius: 20}} iconColor="#707070" />
                                </View>
                            </ColorPicker>
                            <View style={{paddingTop: 15, alignItems: 'center'}}>
                                <TouchableOpacity
                                    style={styles.selectColour}
                                    onPress={()=> {
                                        setColour(selectedColour.value);
                                        setShowModal(false);
                                    }}
                                >
                                    <Text>Select Colour</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <View>
                    <TextInput
                        style={styles.header}
                        placeholder="Module title"
                        placeholderTextColor={'gray'}
                        onChangeText={(text) => setNewModuleTitle(text)}
                        value={newModuleTitle}
                    />
                    <TextInput
                        placeholder="Add description..."
                        placeholderTextColor={'gray'}
                        onChangeText={(text) => setNewModuleDesc(text)}
                        value={newModuleDesc}
                    />
                </View>
                <View style={{paddingTop: 150}}>
                    <Text style={styles.header}>Layout</Text>
                </View>
            </View>  
            <View style={{flexDirection: 'row',justifyContent: 'space-between', position: 'absolute', bottom: 50, right: 30}}>
                <View>
                    <TouchableOpacity onPress={()=>router.navigate('/home')} style={{backgroundColor: 'lightblue', borderRadius: 20, padding: 10, alignItems: 'center'}}>
                        <Text>go back</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity 
                        onPress={()=>{
                            addNewModule();
                            setNewModuleTitle('');
                            setNewModuleDesc('');
                            setColour('');
                            router.navigate('/home')
                            
                        }} style={{backgroundColor: 'lightgreen', borderRadius: 20, padding: 10, alignItems: 'center'}}>
                        <Text>add module</Text>
                    </TouchableOpacity>
                </View>
            </View> 
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
      },
    header: {
        fontWeight: 'bold',
        fontSize: 30,
        paddingTop: 20,
        paddingBottom: 5
    },
    pickerContainer: {
        alignSelf: 'center',
        width: 300,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    
        elevation: 10,
      },
      hueContainer: {
        justifyContent: 'center',
      },
      panelStyle: {
        width: '70%',
        height: '70%',
        alignSelf: 'center',
        borderRadius: 16,
      },
      swatchesContainer: {
          paddingTop: 20,
          marginTop: 20,
          borderTopWidth: 1,
          borderColor: '#bebdbe',
          alignItems: 'center',
          flexWrap: 'nowrap',
          gap: 10,
        },
        swatchStyle: {
          borderRadius: 20,
          height: 30,
          width: 30,
          margin: 0,
          marginBottom: 20,
          marginHorizontal: 0,
          marginVertical: 0,
        },
        selectColour: {
          backgroundColor: 'pink',
          borderRadius: 40,
          padding: 10,
          paddingHorizontal: 20,
          alignItems: 'center',
        }
})
