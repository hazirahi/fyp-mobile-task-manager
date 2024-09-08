import { View, StyleSheet, Alert, TextInput, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

import { supabase } from "@/config/initSupabase";
import { useAuth } from '@/provider/AuthProvider';
import Avatar from '@/components/Avatar';

import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { UserBadge } from '@/types/types';
import BadgeList from '@/components/BadgeList';

//https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native?queryGroups=auth-store&auth-store=secure-store

export default function Account (){
    const { user, session } = useAuth();
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    const [userBadgeList, setUserBadgeList] = useState<UserBadge[]>([]);
    const [equippedBadge, setEquippedBadge] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        
        getProfile();
        getUserBadges();
        
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

    const getUserBadges = async () => {
        const { data: userBadgeList, error } = await supabase
            .from('user_badges')
            .select('*, badges(*)')
            .eq('user_id', user!.id)
        if (error)
            console.log(error.message)
        else
            setUserBadgeList(userBadgeList!)
    }

    const handleBadgePress = async (badgeId: number, signedUrl: string | null) => {
        setEquippedBadge(signedUrl);
        await updateEquippedBadge(badgeId);
    };

    const updateEquippedBadge = async (badgeId: number) => {
        try { 
            await supabase 
                .from('user_badges')
                .update({equipped: false})
                .eq('user_id', user!.id)

            await supabase
                .from('user_badges')
                .update({equipped: true})
                .eq('user_id', user!.id)
                .eq('badge_id', badgeId)
        } catch (error: any) {
            console.log(error.message)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient 
                colors={['#0084FF','#16B4F8', '#8CDCF9', '#FFFFFF']}
                style={styles.background}
            />
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
                    {equippedBadge && (
                        <View style={{position: 'absolute', top: 100, right: 5}}>
                            <SvgUri width={70} height={70} uri={equippedBadge}/>
                        </View>
                    )}
                    <View style={{paddingTop: 15}}>
                        <TextInput placeholder='name' placeholderTextColor='#A4D44C' value={name || ''} onChangeText={(text) => setName(text)} style={[styles.input, {fontSize: 30, fontWeight: '700'}]} onEndEditing={()=> updateProfile({ name, email, avatar_url: avatarUrl })} />
                    </View>
                    <View style={{paddingTop: 5}}>
                        <TextInput placeholder='email' placeholderTextColor='#A4D44C' value={email || ''} onChangeText={(text) => setEmail(text)} style={styles.input} onEndEditing={()=> updateProfile({ name, email, avatar_url: avatarUrl })} />
                    </View>
                </View>
            </View>
            <View style={{paddingTop: 20}}>
                <Text style={styles.header}>Badges: </Text>
                <View style ={{backgroundColor: '#A6F511', padding: 20, borderWidth: 1, borderRadius: 10}}>
                    <View>
                        <BadgeList
                            badges={userBadgeList}
                            onBadgePress={handleBadgePress}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: 'white',
        paddingHorizontal: 20
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
    header: {
        fontSize: 22,
        fontWeight: '700',
        paddingBottom: 5
    }
})