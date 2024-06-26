import { AuthProvider, useAuth } from '@/provider/AuthProvider';
import { Slot, useSegments, useRouter } from 'expo-router';
import { useEffect } from 'react';

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
    return (
        <AuthProvider>
            <InitialLayout/>
        </AuthProvider>
    );
};

export default RootLayout;