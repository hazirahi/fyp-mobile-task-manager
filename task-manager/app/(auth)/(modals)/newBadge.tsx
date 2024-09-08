import { useBadgeList } from "@/provider/BadgeProvider";
import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";

const NewBadge = () => {
    const { awardedBadge, handleHideModal, showModal } = useBadgeList();
    
    return (
        <Modal 
            onRequestClose={handleHideModal}
            visible={showModal}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.container}>
                <Text style={styles.header}>New Badge!</Text>
                <Text style={{fontWeight: '500', fontSize: 15, paddingBottom: 25, textAlign: 'center'}}>You just got the '{awardedBadge?.badge_name}' badge!</Text>
                <TouchableOpacity
                    onPress={handleHideModal}
                    style={styles.closebtn}
                >
                    <Text style={{fontWeight: '600', fontSize: 13}}>Close</Text>
                </TouchableOpacity>
            </View>
        </Modal>

    )
}

const styles = StyleSheet.create({
    container: {
        top: 300,
        alignItems: 'center',
        alignSelf: 'center',
        width: 300,
        height: 180,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10
    },
    header: {
        fontWeight: '600',
        fontSize: 23,
        paddingBottom: 20
    },
    closebtn: {
        alignSelf: 'center',
        borderWidth: 1,
        padding: 6,
        borderRadius: 10,
        backgroundColor: '#A6F511',
        paddingHorizontal: 15
    }
})

export { NewBadge };