import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

import { supabase } from "@/config/initSupabase";
import { Badge, UserBadge } from "@/types/types";

import BadgeListItem from "./BadgeListItem";

type BadgeList = {
    badges: UserBadge[];
    onBadgePress: (badgeId: number, signedUrl: string | null) => void;
}

const BadgeList = ({badges, onBadgePress}: BadgeList) => {
    const [badgeData, setBadgeData] = useState<Badge[]>([]);
    
    const getBadgeData = async (userBadges: UserBadge[]) => {
        const badgeIds = userBadges.map((userBadges) => userBadges.badge_id);
        //console.log('badgeids: ', badgeIds)
        const { data, error } = await supabase
            .from('badges')
            .select('*')
            .in('id', badgeIds)
        if (error){
            console.log(error.message)
            return [];
        } else {
            const badgeDataWithSignedUrls = await Promise.all(
                data.map(async (badge) => {
                    const { data: signedUrl, error: signedUrlError } = await supabase
                        .storage
                        .from('badges')
                        .createSignedUrl(badge.badge_url, 1800);
                    
                    if (signedUrlError) {
                        console.log(signedUrlError.message)
                        return null;
                    } else {
                        return { ...badge, signedUrl: signedUrl.signedUrl };
                    }
                })
            );
            return badgeDataWithSignedUrls.filter((badge) => badge !== null);
        }
    };

    useEffect(() => {
        getBadgeData(badges).then((data) => setBadgeData(data));
    }, [badges]);

    return (
        <View>
            {badgeData.length === 0 ? (
                <Text style={{textAlign: 'center', padding: 20, fontSize: 16, paddingHorizontal: 45}}>you haven't acquired any badges yet! explore the app to start collecting.</Text>
            ) : (
                <FlatList
                    data={badgeData}
                    renderItem={({item}) => (
                        <BadgeListItem
                            badge={item}
                            onPress={() => {
                                onBadgePress(item.id, item.signedUrl?? '');
                                console.log('badgelsit: ', item.id)
                            }}
                        />
                    )}
                    keyExtractor={(item) => `${item.id}`}
                    numColumns={4}
                    columnWrapperStyle={{justifyContent: 'space-between', padding: 5}}
                />
            )}
            
        </View>
    )
}

export default BadgeList;