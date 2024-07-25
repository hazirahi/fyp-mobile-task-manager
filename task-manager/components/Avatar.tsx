import { useState, useEffect } from "react";
import { supabase } from "@/config/initSupabase";
import { StyleSheet, View, Alert, Image, Button, TouchableOpacity } from "react-native";
import * as ImagePicker from 'expo-image-picker';

interface Props{
    size: number
    url: string | null
    onUpload: (filePath: string) => void
}

export default function Avatar({ url, size=150, onUpload}: Props){
    const [uploading, setUploading] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const avatarSize = {height: size, width: size}

    useEffect(() => {
        if (url) downloadImage(url)
    }, [url])

    async function downloadImage(path:string){
        try {
            const {data, error} = await supabase.storage.from('avatars').download(path)

            if (error){
                throw error
            }

            const fr = new FileReader()
            fr.readAsDataURL(data)
            fr.onload = () => {
                setAvatarUrl(fr.result as string)
            }
        } catch (error){
            if (error instanceof Error) {
                console.log('error downloading image: ', error.message)
            }
        }
    }

    async function uploadAvatar() {
        try{
            setUploading(true)

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, //restrict to only images
                allowsMultipleSelection: false, //can only select one image
                allowsEditing: true, // allows user to crop/rotate photo before uploading
                quality: 1,
                exif: false, //we dont want nor need this
            })

            if (result.canceled || !result.assets || result.assets.length === 0) {
                console.log('user cancelled image picker');
                return
            }

            const image = result.assets[0]
            console.log('got image', image)

            if(!image.uri) {
                throw new Error('no image uri')
            }

            const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())

            const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg'
            const path = `${Date.now()}.${fileExt}`
            const {data, error: uploadError} = await supabase.storage
                .from('avatars')
                .upload(path, arraybuffer, {
                    contentType: image.mimeType ?? 'image/jpeg',
                })
            
                if (uploadError){
                    throw uploadError
                }

                onUpload(data.path)
        } catch (error){
            if (error instanceof Error){
                Alert.alert(error.message)
            } else {
                throw error
            }
        } finally {
            setUploading(false)
        }
    }

    return (
        <View>
            {avatarUrl ? (
                <TouchableOpacity onPress={uploadAvatar}>
                    <Image
                        source={{uri: avatarUrl}}
                        accessibilityLabel="Avatar"
                        style={[avatarSize, styles.avatar, styles.image]}
                    />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={uploadAvatar}>
                    <View style={[avatarSize, styles.avatar, styles.noImage]}/>
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    avatar: {
    //   borderRadius: 5,
      overflow: 'hidden',
      maxWidth: '100%'
    },
    image: {
        width: 120,
        height: 140,
      objectFit: 'cover',
      paddingTop: 0,
    //   borderRadius: 200 / 2
    },
    noImage: {
      backgroundColor: '#333',
    //   borderRadius: 200 /2,
    },
  })
