import React, { useState, useEffect, createContext, PropsWithChildren } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from '@/config/initSupabase';

type AuthProps = {
    user: User | null;
    session: Session | null;
    initialized?: boolean;
    signOut?: () => void;
};

export const AuthContext = createContext<Partial<AuthProps>>({});

//custom hook to read context values
export function useAuth() {
    return React.useContext(AuthContext);
}

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User | null>();
    const [session, setSession] = useState<Session | null>(null);
    const [initialized, setInitialized] = useState<boolean>(false);
    const [tokenSize, setTokenSize] = useState<number>(0);

    useEffect(() => {
        //listen for changes to authentication state
        const {data} = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            setUser(session ? session.user : null);
            setInitialized(true);

            if (session) {
                const tokenSize = await getTokenSize(session);
                setTokenSize(tokenSize)
                console.log(tokenSize)
            }
        });
        return () => {
            data.subscription.unsubscribe();
        };
    }, []);

    //log out the user
    const signOut = async () => {
        await supabase.auth.signOut();
    };

    const getTokenSize = async (session: Session) => {
        if (!session) return 0;
        const token = session.access_token;
        const encodedToken = btoa(token);
        const tokenSize = encodedToken.length;
        return tokenSize;
    };

    const value = {
        user,
        session,
        initialized,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};