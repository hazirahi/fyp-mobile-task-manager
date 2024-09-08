import { forwardRef, useImperativeHandle, useRef, useState, useMemo, useCallback } from "react";
import { View } from "react-native";
import { TimerPicker } from "react-native-timer-picker";

import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";

import { LinearGradient } from "expo-linear-gradient";

type Ref = BottomSheetModal;
type OnDurationChange = (duration: number) => void;

const DurationPicker = forwardRef<Ref, {onDurationChange: OnDurationChange}>(({onDurationChange} , ref) => {
    const innerRef = useRef<Ref>(null);
    const [selectedDuration, setSelectionDuration] = useState(25 * 60);

    useImperativeHandle<Ref|null, Ref|null>(
        ref,
        () => innerRef.current
    );

    const snapPoints = useMemo(() => ['35%', '40%'], []);
    const renderBackdrop = useCallback(
        (props:any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []
    );

    const handleDurationChange = (duration: {hours: number, minutes: number, seconds: number}) => {
        const totalSeconds = duration.hours * 3600 + duration.minutes * 60 + duration.seconds;
        setSelectionDuration(totalSeconds)
        onDurationChange(totalSeconds);
    }

    return (
        <BottomSheetModal
            ref={innerRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{backgroundColor: '#302F33'}}
            backgroundStyle={{backgroundColor: '#8CDCF9'}}
        >
            <View style={{alignItems: 'center', justifyContent: 'center', paddingTop: 40}}>
                <TimerPicker
                    hideHours
                    LinearGradient={LinearGradient}
                    minuteLabel={'min'}
                    secondLabel={'sec'}
                    styles={{
                        pickerItem: {
                            fontSize: 45,
                            fontWeight: '400'
                        },
                        pickerLabel: {
                            fontSize: 25,
                            right: -5,
                            fontWeight: 'condensedBold'
                        },
                        backgroundColor: '#8CDCF9'
                    }}
                    onDurationChange={handleDurationChange}
                    initialValue={{minutes: 25}}
                    disableInfiniteScroll
                />
            </View>
        </BottomSheetModal>
    )
})

export default DurationPicker;