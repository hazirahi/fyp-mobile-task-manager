
import { useState } from "react";
import { Alert, Button, Platform, Text, View } from "react-native";

// import DateTimePicker, { DateTimePickerEvent }  from "@react-native-community/datetimepicker";

import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

export default function AddDateTimePicker () {
    // const [date, setDate] = useState(new Date());
    // const [show, setShow] = useState(false);
    // const [maxDate] = useState(new Date('2030'));
    // const [minDate] = useState(new Date('2010'));

    // const onChange = (e: DateTimePickerEvent , selectedDate: Date | undefined) => {
    //     const currentDate = selectedDate || date;
    //     //setShow(false);
    //     setDate(currentDate);
    // }

    // const showDatePicker = () => {
    //     setShow(true);
    // };


    const [date, setDate] = useState(dayjs());

    return (
        <View style={{paddingHorizontal: 20}}>
            <DateTimePicker
                mode="single"
                date={date}
                onChange={(params) => setDate(dayjs(params.date))}
            />
            {/* <View style={{paddingBottom: 60}}>
                <Text>{date.toDateString()}</Text>
            </View> */}
            {/* <View style={{flexDirection: 'row', borderWidth: 1, justifyContent: 'space-evenly', paddingVertical: 20}}>
                <View>
                    <Text style={{paddingLeft: 10}}>Start Date</Text>
                    <DateTimePicker
                        value={date}
                        mode="date"
                        onChange={onChange}
                    />
                </View>
                <View>
                    <Text style={{paddingLeft: 10}}>End Date</Text>
                    <DateTimePicker
                        value={date}
                        mode="date"
                        onChange={onChange}
                    />
                </View>
            
            </View> */}
            
            
            
        </View>
    )
}