import { AuthProvider, useAuth } from '@/provider/AuthProvider';
import BadgeListProvider from '@/provider/BadgeProvider';
import TaskListProvider from '@/provider/TaskListProvider';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts } from 'expo-font';

import { Slot, useSegments, useRouter, SplashScreen } from 'expo-router';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NewBadge } from './(auth)/(modals)/newBadge';

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
            router.replace('/home');
        } else if (!session){
            //redirect unauthenticated users to login page
            router.replace('/login');
        }
    }, [session, initialized]);

    return <Slot/>;
};

const RootLayout = () => {
    const [loaded, error] = useFonts({
        'EBGaramond' : require('../assets/fonts/EBGaramond-Italic-VariableFont_wght.ttf')
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
                <BottomSheetModalProvider>
                <BadgeListProvider>
                    <NewBadge/>
                    <TaskListProvider>
                        
                            <InitialLayout/>   
                            </TaskListProvider> 
                        </BadgeListProvider>
                    
                </BottomSheetModalProvider>
            </AuthProvider>
        </GestureHandlerRootView>
        
    );
};

export default RootLayout;