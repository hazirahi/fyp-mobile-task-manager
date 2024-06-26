import { View, Text, StyleSheet, Alert, TextInput, Button, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { supabase } from "@/config/initSupabase";
import { Session } from '@supabase/supabase-js';

import Avatar from '@/components/Avatar';
import { Ionicons } from '@expo/vector-icons';

//https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native?queryGroups=auth-store&auth-store=secure-store

export default function Account (){
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
        });

    }, []);

    useEffect(() => {
        if (session) getProfile();
    }, [session]);

    async function getProfile(){
        try{
            setLoading(true)
            if (!session?.user) throw new Error('no user on session');

            const { data, error, status } = await supabase
                .from('users')
                .select(`name, email, avatar_url`)
                .eq('id', session?.user.id)
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
            if(!session?.user) throw new Error('no user on the session')
            
            const updates = {
                id: session?.user.id,
                name,
                email,
                avatar_url,
            }
            
            console.log(session.user.email);
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
            <TouchableOpacity style={styles.settingsBTN}>
                <Ionicons name="settings" size={35} color="black" />
            </TouchableOpacity>
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
                <TextInput placeholder={session?.user.email} value={email || ''} onChangeText={(text) => setEmail(text)} style={styles.input} onEndEditing={()=> updateProfile({ name, email, avatar_url: avatarUrl })} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 40,
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
        color: 'black',
        backgroundColor: 'gray'
    },
})