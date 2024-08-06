import { useState } from "react";
import { SafeAreaView, Text, StyleSheet, View, Modal, Keyboard } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import ColorPicker, { colorKit, HueCircular, InputWidget, Panel1, returnedResults, Swatches } from "reanimated-color-picker";
import { LinearGradient } from "expo-linear-gradient";

import { router } from "expo-router";
import { FontAwesome, Ionicons } from '@expo/vector-icons';

import { useTaskList } from "@/provider/TaskListProvider";
import { Circle, Svg } from "react-native-svg";

export default function AddModule() {

    const [showModal, setShowModal] = useState(false);
    const [colour, setColour] = useState('');

    const customSwatches = new Array(6).fill('#fff').map(() => colorKit.randomRgbColor().hex());

    const selectedColour = useSharedValue(customSwatches[0]);
    const backgroundColourStyle = useAnimatedStyle(() => ({ backgroundColor: selectedColour.value }));

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
            <LinearGradient
                colors={['#A6F511','#D5FF61', '#F6FF78', '#FFFFFF', '#F6FF78', '#D5FF61', '#A6F511']}
                style={styles.background}
            />
            <View style={{paddingLeft: 15, width: 40}}>
                <TouchableOpacity onPress={() => router.navigate('/home')}>
                    <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={{alignItems: 'center', paddingTop: 20}}>
                <View style={{padding: 10, borderRadius: 10, borderWidth: 1}}>
                    <TouchableOpacity onPress={() => setShowModal(true)}>
                        <Svg height={100} width={100} viewBox="0 0 100 100" >
                            <Circle
                                cx={50}
                                cy={50}
                                r={45}
                                fill={selectedColour.value}
                                stroke={'black'}
                                strokeWidth={1}
                            />
                        </Svg>
                    </TouchableOpacity>
                    {/* colour picker modal */}
                    <Modal onRequestClose={() => {setColour(selectedColour.value); setShowModal(false);}} visible={showModal} animationType="slide" transparent={true}>
                        <View style={styles.container}>
                            <Animated.View style={[styles.pickerContainer, {backgroundColor: 'white'}]}>
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
                                        onPress={()=> {
                                            setColour(selectedColour.value);
                                            setShowModal(false);
                                        }}
                                    >
                                        <Animated.View style={[styles.selectColour, backgroundColourStyle]}>
                                            <Text>Select Colour</Text>
                                        </Animated.View>
                                        
                                    </TouchableOpacity>
                                </View>
                            </Animated.View>
                        </View>
                    </Modal>
                </View>
            </View>
            <View style={{paddingHorizontal: 20, paddingTop: 20}}>
                <View style={{paddingVertical: 10}}>
                    <Text style={styles.header}>Module title:</Text>
                    <TextInput
                        style={{padding: 15, backgroundColor: 'white', borderWidth: 1, borderRadius: 15}}
                        placeholder="add module"
                        onChangeText={(text) => setNewModuleTitle(text)}
                        value={newModuleTitle}
                        onEndEditing={() => Keyboard.dismiss()}
                    />
                </View>
                <View style={{paddingVertical: 10}}>
                    <Text style={styles.header}>Description:</Text>
                    <TextInput
                        style={{padding: 15, backgroundColor: 'white', borderWidth: 1, borderRadius: 15}}
                        placeholder="add description"
                        onChangeText={(text) => setNewModuleDesc(text)}
                        value={newModuleDesc}
                        onEndEditing={() => Keyboard.dismiss()}
                    />
                </View>
            </View>
            <View style={{padding: 20, position: 'absolute', bottom: 20}}>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        addNewModule();
                        setColour('');
                        setNewModuleTitle('');
                        setNewModuleDesc('');
                        router.navigate('/home');
                    }}
                >
                    <Text style={{padding: 10, paddingHorizontal: 25, textAlign: 'center', fontWeight: '600', fontSize: 16}}>Add Module</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>

    
        //         </View>
        //         <View>
        //             <TouchableOpacity 
        //                 onPress={()=>{
        //                     addNewModule();
        //                     setNewModuleTitle('');
        //                     setNewModuleDesc('');
        //                     setColour('');
        //                     router.navigate('/home')
                            
        //                 }} style={{backgroundColor: 'lightgreen', borderRadius: 20, padding: 10, alignItems: 'center'}}>
        //                 <Text>add module</Text>
        //             </TouchableOpacity>
        //         </View>
        //     </View> 
        // </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 900
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    header: {
        fontWeight: '600',
        fontSize: 20,
        paddingBottom: 5
    },
    pickerContainer: {
        alignSelf: 'center',
        width: 300,
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
        borderRadius: 40,
        padding: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderWidth: 1
    },
    addButton: {
        alignSelf: 'center',
        backgroundColor: '#A6F511',
        borderRadius: 20,
        width: 348,
        borderWidth: 1
    }
})
