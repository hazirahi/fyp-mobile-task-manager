import { createContext, PropsWithChildren, useContext, useState } from "react";
import { supabase } from "@/config/initSupabase";
import { useAuth } from '@/provider/AuthProvider';
import { Badge, UserBadge } from "@/types/types";
//import { showModalCallback } from "@/app/(auth)/(modals)/newBadge";


type BadgeListItem = {
    badges: Badge[];
    awardedBadge: Badge | null;
    showModal: boolean;
    getBadges: () => void;
    awardBadge: (userId: string, badgeId: UserBadge['badge_id']) => void;
    hasEarnedBadge: (badgeId: UserBadge['badge_id']) => Promise<boolean>;
    handleShowModal: () => void,
    handleHideModal: () => void
    //firstTask: () => void;
};

const BadgeListContext = createContext<BadgeListItem>({
    badges: [],
    awardedBadge: null,
    showModal: false,
    handleShowModal: () => {},
    handleHideModal: () => {},
    getBadges: () => {},
    awardBadge: () => {},
    hasEarnedBadge: () => Promise.resolve(false),
    //firstTask: () => {}
});

const BadgeListProvider = ({ children }: PropsWithChildren) => {
    const { user } = useAuth();
    const [badgeList, setBadgeList] = useState<Badge[]>([]);
    const [awardedBadge, setAwardedBadge] = useState<Badge | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleHideModal = () => {
        setShowModal(false);
    }

    const getBadges = async () => {
        const { data: badgeList, error } = await supabase
            .from('badges')
            .select('*')
        if (error)
            console.log(error.message)
        else
            setBadgeList(badgeList!)
    }

    //award badge
    // async function awardBadge(userId: string, badgeId: number) {
    //     console.log('awarding badge: ', badgeId, userId)
    //     const { data, error } = await supabase
    //         .from('user_badges')
    //         .insert([{
    //             user_id: userId,
    //             badge_id: badgeId,
    //             earned_at: new Date()
    //         }])
    //         .select('*')
    //         .single()
    //     if (error) {
    //         console.log(error.message)
    //     } else {
    //         console.log(data);
    //     }
    // }

    const awardBadge = async (
        userId: string,
        badgeId: number
    ) => {
        console.log('awarding badge: ', badgeId, userId)
        try {
            const { data, error } = await supabase
                .from('user_badges')
                .insert({
                    badge_id: badgeId,
                    user_id: userId,
                    earned_at: new Date(),
                    equipped: false
                })
                .select('*')
                .single()
            if (error) {
                console.log(error.message)
            } else {
                const { data: badgeData, error: badgeError } = await supabase
                    .from('badges')
                    .select('*')
                    .eq('id', badgeId)
                    .single()
                
                    if (badgeError) {
                        console.log(badgeError.message)
                    } else {
                        setAwardedBadge(badgeData);
                        handleShowModal();
                    }
            }
        } catch (error: any) {
            console.log(error.message)
        }
        
    }

    // check if user has earned a badge
    async function hasEarnedBadge(badgeId: number): Promise<boolean>{
        console.log('called w badge id: ', badgeId)
        let result: boolean;
        try {
            const { data, error } = await supabase
                .from('user_badges')
                .select('id')
                .eq('user_id', user!.id)
                .eq('badge_id', badgeId)
            result = data !== null && data.length > 0
        } catch (error: any){
            console.log(error.message)
            result = false;
        } 
        return result;
    }

    return (
        <BadgeListContext.Provider value={{
            badges: badgeList,
            awardedBadge,
            showModal,
            handleShowModal,
            handleHideModal,
            getBadges,
            awardBadge,
            hasEarnedBadge
        }}>
            {children}
        </BadgeListContext.Provider>

    );
};

export default BadgeListProvider;

export const useBadgeList = () => useContext(BadgeListContext);
