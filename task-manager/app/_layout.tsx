import { AuthProvider, useAuth } from '@/provider/AuthProvider';
import TaskListProvider from '@/provider/TaskListProvider';
import { useFonts } from 'expo-font';

import { Slot, useSegments, useRouter, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

const InitialLayout = () => {
    const { session, initialized } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (!initialized) return;
        const inAuthGroup = segments[0] === '(auth)';

        if (session && !inAuthGroup){
            //redirect authenticated users to list page
            router.replace('/(tabs)/home');
        } else if (!session){
            //redirect unauthenticated users to login page
            router.replace('(public)/login');
        }
    }, [session, initialized]);

    return <Slot/>;
};

const RootLayout = () => {
    const [loaded, error] = useFonts({
        'PlayfairDisplay': require('../assets/fonts/PlayfairDisplay-Italic-VariableFont_wght.ttf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }
    return (
        <GestureHandlerRootView>
            <AuthProvider>
                <TaskListProvider>
                    <InitialLayout/>    
                </TaskListProvider>
            </AuthProvider>
        </GestureHandlerRootView>
        
    );
};

export default RootLayout;