import { Alert, View, Button, TextInput, StyleSheet, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useState } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { supabase } from '@/config/initSupabase';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const onSignInPress = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) Alert.alert('error signing in', error.message);
        setLoading(false);
    };

    

    return (
        <SafeAreaView style={styles.container}>
          <LinearGradient 
            colors={['#0084FF','#16B4F8', '#8CDCF9', '#FFFFFF']}
            style={styles.background}
          />
          <View style={{paddingHorizontal: 30, paddingTop: 200}}>
            <Text style={styles.header}>Log in</Text>
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
              <TouchableOpacity onPress={()=>router.navigate('/signup')} style={styles.button}>
                <Text style={{color: 'white'}}>Create Account</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onSignInPress} style={[styles.button, {backgroundColor: '#0084FF'}]}>
                <Text style={{color: 'white'}}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
    );
};

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
    fontSize: 70,
    fontWeight: '400',
    paddingBottom: 20
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

export default Login;