import { View, StyleSheet, Alert, TextInput, Image, Text, FlatList, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

import { supabase } from "@/config/initSupabase";
import { AuthProvider, useAuth } from '@/provider/AuthProvider';
import Avatar from '@/components/Avatar';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri, Path, G, Circle } from 'react-native-svg';
import { useBadgeList } from '@/provider/BadgeProvider';
import { UserBadge } from '@/types/types';
import BadgeList from '@/components/BadgeList';

//https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native?queryGroups=auth-store&auth-store=secure-store

interface FileObject {
    name: string;
}

export default function Account (){
    const { user, session } = useAuth();
    const { badges } = useBadgeList();
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    const [badgeList, setBadgeList] = useState<FileObject[]>([]);
    const [userBadgeList, setUserBadgeList] = useState<UserBadge[]>([]);
    const [badgeUrls, setBadgeUrls] = useState<string[]>([]);
    const [equippedBadge, setEquippedBadge] = useState<string | null>(null);

    // const handleBadgePress = (url: string) => {
    //     setEquippedBadge(url);
    // };

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

    // const getBadges = async () => {
    //     const { data:badgeList, error } = await supabase
    //         .storage
    //         .from('badges')
    //         .list();

    //     if (error) {
    //         console.log(error.message);
    //     } else {
    //         setBadgeList(badgeList!);
            
    //         try {
    //             await supabase.storage.from('badges').remove(['.emptyFolderPlaceholder']);
    //         } catch (error) {
    //             console.log((error as Error).message);
    //         }
    //         // console.log(badgeList);
    //         const signedUrls = await Promise.all(
    //             badgeList.map(async (badge) => {
    //                 const { data, error } = await supabase
    //                     .storage
    //                     .from('badges')
    //                     .createSignedUrl(badge.name, 3600);
                    
    //                 if (error) {
    //                     console.log(error.message);
    //                     return null;
    //                 }
    //                 //console.log(data.signedUrl)
    //                 return data.signedUrl;
    //             })
    //         );
    //         //console.log(signedUrls)
    //         setBadgeUrls(signedUrls.filter((url) => url !== null));
    //         //setBadgeList(badgeList!);
            
    //     }
    // };

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

    

    // const BadgeItem = ({item} : {item:FileObject}) => {
    //     const [imageUrl, setImageUrl] = useState('');

    //     const getSignedUrl = async () => {
    //         const { data, error } = await supabase.storage
    //             .from('badges')
    //             .createSignedUrl(item.name, 60);

    //         if (error) {
    //             console.log(error.message)
    //         } else {
    //             setImageUrl(data.signedUrl);
    //         }
    //     };

    //     getSignedUrl();

    //     return (
    //         <View>
    //             {imageUrl ? (
    //                 <Image
    //                     source={{uri: imageUrl}}
    //                     style={{width: 70, height: 70, resizeMode:'contain'}}
    //                     onError={(error) => console.log('Error loading image:', error)}
    //                 />
    //             ) : (
    //                 <View>
    //                     <Text>help la</Text>
    //                 </View>
    //             )}
                
    //         </View>
    //     );
    // }

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
                        <TextInput placeholder='name' value={name || ''} onChangeText={(text) => setName(text)} style={[styles.input, {fontSize: 30, fontWeight: '700'}]} onEndEditing={()=> updateProfile({ name, email, avatar_url: avatarUrl })} />
                    </View>
                    <View style={{paddingTop: 5}}>
                        <TextInput placeholder='email' value={email || ''} onChangeText={(text) => setEmail(text)} style={styles.input} onEndEditing={()=> updateProfile({ name, email, avatar_url: avatarUrl })} />
                    </View>
                </View>
            </View>
            <View style={{paddingTop: 20}}>
                <Text style={styles.header}>Badges: </Text>
                <View style ={{backgroundColor: '#A6F511', padding: 20, borderWidth: 1, borderRadius: 10}}>
                    {/* <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                        {badgeUrls.map((url, index) => (
                            <TouchableOpacity key={index} onPress={() => handleBadgePress(url)}>
                                <SvgUri
                                    width={60}
                                    height={60}
                                    uri={url}
                                />
                            </TouchableOpacity>
                        ))}
                    </View> */}
                    <View>
                        <BadgeList
                            badges={userBadgeList}
                            onBadgePress={setEquippedBadge}
                        />
                    </View>
                </View>
            </View>
            {/* <View style={{paddingTop: 20}}>
                <Text style={styles.header}>This Week's Progress: </Text>
                <View style ={{backgroundColor: '#A6F511', padding: 20, borderWidth: 1, borderRadius: 10}}>
                </View>
            </View> */}
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