import { View, Text, StyleSheet, Alert, TextInput, Button, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

import { supabase } from "@/config/initSupabase";
import { useAuth } from '@/provider/AuthProvider';
import Avatar from '@/components/Avatar';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

//https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native?queryGroups=auth-store&auth-store=secure-store

export default function Account (){
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    useEffect(() => {
        if (user) getProfile();
    }, [user]);

    async function getProfile(){
        try{
            setLoading(true)
            if (!user) throw new Error('no user on session');

            const { data, error, status } = await supabase
                .from('users')
                .select(`name, email, avatar_url`)
                .eq('id', user.id)
                .single()
            if (error && status !== 406){
                throw error
            }
            if (data){
                setName(data.name)
                setEmail(data.email)
                setAvatarUrl(data.avatar_url)
            }
        } catch (error){
            if (error instanceof Error){
                Alert.alert(error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    async function updateProfile({
        name,
        email,
        avatar_url,
    }: {
        name: string
        email: string
        avatar_url: string
    }) {
        try {
            setLoading(true);
            if(!user) throw new Error('no user on the session')
            
            const updates = {
                id: user.id,
                name,
                email,
                avatar_url,
            }
            
            console.log(user.email);
            const {error} = await supabase.from('users').upsert(updates);

            if (error){
                throw error
            }
        } catch (error) {
            if (error instanceof Error){
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* <View style={{backgroundColor: 'lightpink', padding: 15, paddingBottom: 20, borderRadius: 10, flexDirection: 'row'}}>
                <View >
                    <Avatar 
                        size={130}
                        url={avatarUrl}
                        onUpload={(url:string) => {
                            setAvatarUrl(url)
                            updateProfile({ name, email, avatar_url: url})
                        }}
                    />
                </View>
                <View style={{paddingHorizontal: 20, paddingTop: 70}}>
                    <View style={{flexDirection: 'row', paddingTop: 25}}>
                        <View style={{paddingRight: 15}}>
                            <View>
                                <Text style={{fontSize: 10}}>NAME</Text>
                                <Text style={{fontWeight:500, fontSize:14}}>{name}</Text>
                            </View>
                            <View>
                                <Text style={{fontSize: 10}}>SCHOOL</Text>
                                <Text style={{fontWeight:500, fontSize:14}}>insert school</Text>
                            </View>
                        </View>
                        <View>
                            <View>
                                <Text style={{fontSize: 10}}>DATE OF BIRTH</Text>
                                <Text style={{fontWeight:500, fontSize:14}}>insert dob</Text>
                            </View>
                            <View>
                                <Text style={{fontSize: 10}}>IDK</Text>
                                <Text style={{fontWeight:500, fontSize:14}}>insert idk</Text>
                            </View>
                        </View>
                    </View>
                    
                    
                </View>
                
            </View> */}
            <LinearGradient 
                colors={['#0084FF','#16B4F8', '#8CDCF9', '#FFFFFF']}
                style={styles.background}
            />
            {/* <TouchableOpacity style={styles.settingsBTN}>
                <Ionicons name="settings" size={35} color="black" />
            </TouchableOpacity> */}
            <View style={{paddingTop: 30, paddingHorizontal: 20, alignItems: 'center'}}>
                <View style={styles.card}>
                    <View style={styles.profileimg}>
                        <Avatar 
                            size={130}
                            url={avatarUrl}
                            onUpload={(url:string) => {
                                setAvatarUrl(url)
                                updateProfile({ name, email, avatar_url: url})
                            }}
                        />
                    </View>
                    <View style={{paddingTop: 20}}>
                        <TextInput placeholder='Your Name' value={name || ''} onChangeText={(text) => setName(text)} style={[styles.input, {fontSize: 30, fontWeight: '700'}]} onEndEditing={()=> updateProfile({ name, email, avatar_url: avatarUrl })} />
                    </View>
                    <View style={{paddingTop: 5}}>
                        <TextInput placeholder='email' value={email || ''} onChangeText={(text) => setEmail(text)} style={styles.input} onEndEditing={()=> updateProfile({ name, email, avatar_url: avatarUrl })} />
                    </View>
                </View>
            </View>
            
        </SafeAreaView>
    );
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
    card: {
        backgroundColor: '#A6F511',
        padding: 20,
        height: 250,
        width: 180,
        borderRadius: 10,
        borderWidth: 1
    },
    settingsBTN: {
        position: 'absolute',
        paddingTop: 50,
        right: 30
    },
    profileimg: {
        alignItems: 'center'
    },
    input: {
        alignSelf: 'center',
        color: 'black'
    },
})