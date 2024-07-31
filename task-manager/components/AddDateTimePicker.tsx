import { forwardRef, useImperativeHandle, useRef, useState, useMemo, useCallback } from "react";
import { Alert, Button, Platform, Text, View } from "react-native";
import DateTimePicker from 'react-native-ui-datepicker';

import dayjs from 'dayjs';
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";

import { Task } from "@/provider/TaskListProvider";

type Ref = BottomSheetModal;

export type AddDateTime = {
    onAdd: (
        start_date: Task['due_date']
    ) => void;
}

const AddDateTimePicker = forwardRef<Ref, AddDateTime>((props, ref) => {
    const innerRef = useRef<Ref>(null);

    useImperativeHandle<Ref|null, Ref|null>(
        ref,
        () => innerRef.current
    );

    const snapPoints = useMemo(() => ['50%', '60%'], []);
    const renderBackdrop = useCallback(
        (props:any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []
    );

    const [date, setDate] = useState(dayjs());

    const handleConfirm = (newDate: dayjs.Dayjs) => {
        props.onAdd(newDate.toDate());
        innerRef.current?.close();
    }

    return (
        <BottomSheetModal
            ref={innerRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            backdropComponent={renderBackdrop}
            handleIndicatorStyle={{backgroundColor: '#302F33'}}
            backgroundStyle={{backgroundColor: 'white'}}
            keyboardBehavior='fillParent'
        >
            <View style={{paddingHorizontal: 20, paddingTop: 18}}>
                <DateTimePicker
                    mode="single"
                    date={date}
                    onChange={(params) => {
                        setDate(dayjs(params.date));
                        handleConfirm(dayjs(params.date));
                    }}
                    selectedItemColor="#A6F511"
                    selectedTextStyle={{color: 'black'}}
                    headerTextStyle={{fontSize: 20}}
                    weekDaysTextStyle={{fontWeight: '600'}}
                />
            </View>
        </BottomSheetModal>
    )
})

export default AddDateTimePicker;