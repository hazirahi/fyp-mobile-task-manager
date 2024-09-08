import { Badge } from "@/types/types";
import { View, TouchableOpacity } from "react-native";
import { SvgUri } from "react-native-svg";

type BadgeListItem = {
    badge: Badge;
    onPress: () => void;
}

const BadgeListItem = ({badge, onPress}: BadgeListItem) => {
    return (
        <View>
            <TouchableOpacity onPress={onPress}>
                <SvgUri
                    width={60}
                    height={60}
                    uri={badge.signedUrl?? ''}
                    onError={(error) => console.log(error.message)}
                />
            </TouchableOpacity>
        </View>
    )
}

export default BadgeListItem;