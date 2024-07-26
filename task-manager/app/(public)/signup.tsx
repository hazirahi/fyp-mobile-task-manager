import { SafeAreaView, Text, View, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { supabase } from "@/config/initSupabase";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onSignUpPress = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password });

        if (error) Alert.alert('error signing up', error.message);
        else Alert.alert('sign up successful');
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient 
                colors={['#0084FF','#16B4F8', '#8CDCF9', '#FFFFFF']}
                style={styles.background}
            />
            <View style={{paddingHorizontal: 30, paddingTop: 200}}>
                <Text style={styles.header}>Create Account</Text>
                <TextInput
                    autoCapitalize='none' 
                    placeholder='email'
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />
                <TextInput
                    placeholder='password'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={[styles.input, {marginTop: 9}]}
                />
            </View>
            <View style={{alignItems: 'center'}}>
            <View style={{flexDirection: 'row', paddingTop: 20, gap: 15}}>
              <TouchableOpacity onPress={()=>router.back()} style={styles.button}>
                <Text style={{color: 'white'}}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSignUpPress} style={[styles.button, {backgroundColor: '#0084FF'}]}>
                <Text style={{color: 'white'}}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 530
    },
    header: {
        fontSize: 60,
        fontWeight: '400',
        paddingBottom: 20,
        paddingRight: 70,
        lineHeight: 60
    },
    input: {
        borderWidth: 1,
        padding: 13,
        borderRadius: 15,
        backgroundColor: '#EEF8FF',
        borderColor: '#0084FF'
    },
    button: {
        backgroundColor: '#16B4F8',
        borderRadius: 20,
        padding: 13,
        paddingHorizontal: 35,
        borderWidth: 1,
        borderColor: '#0084FF'
    }
});

export default SignUp;