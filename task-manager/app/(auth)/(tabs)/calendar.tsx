import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { Agenda, Calendar, DateData, Timeline, TimelineEventProps } from "react-native-calendars";
import { useEffect, useState } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { useTaskList } from "@/provider/TaskListProvider";
import { TaskCat } from "@/types/types";

export default function CalendarScreen() {
  const { tasks, getTasks } = useTaskList();

  const [items, setItems] = useState<any>({});
  const agendaItems = {};
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [selected, setSelected] = useState('');
  const [calMode, setCalMode] = useState('monthly');

  useEffect(() => {
    getTasks();
  }, []);

  const timeToString = (time: Date) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  
  const renderEmptyDate = () => {
    return <View/>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
          colors={['#A6F511', '#D5FF61', '#F6FF78', '#FFFFFF']}
          style={styles.background}
      />
      <View style={{paddingHorizontal: 20}}>
        <Text style={styles.header}>Calendar</Text>
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day: DateData) => {
              console.log('selected day', day);
              setSelected(day.dateString);
            }}
            markedDates={{
              [selected]: {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: 'orange'
              }
            }}
          />
        </View>
      </View>
      {/* <Agenda
        items={items}
        selectedDate={new Date()}
        renderItem={({ item }: { item: { name: string; description: string } }) => (
          <View>
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
        renderEmptyDate={renderEmptyDate}
        onDayPress={(day: any) => setSelectedDate(day.date)}
        showClosingKnob={false}
        minDate={'2020-01-01'}
        maxDate={'2030-01-01'}
      /> */}



      {/* <View style={{paddingHorizontal: 20}}> */}
        {/* <Text style={styles.header}>Calendar</Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly', paddingBottom: 15}}>
          <TouchableOpacity style={[styles.navBTN, calMode === 'monthly' ? styles.activeNavBTN : null]}
              
          >
              <Text style={{fontWeight: '600'}}>Monthly</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navBTN, calMode === 'agenda' ? styles.activeNavBTN : null]}
              
          >
              <Text style={{fontWeight: '600'}}>Agenda</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navBTN, calMode === 'timeline' ? styles.activeNavBTN : null]}
              
          >
              <Text style={{fontWeight: '600'}}>Timeline</Text>
          </TouchableOpacity>
        </View> */}
        
        
      {/*</View>
        </View>
      </View> */}
    </SafeAreaView>
  )
}



const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'white'
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 730
  },
  header: {
    fontFamily: 'EBGaramond',
    fontSize: 50,
    fontWeight: '600',
    //paddingTop: 10,
    paddingBottom: 10
  },
  navBTN: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 15
  },
  activeNavBTN: {
    backgroundColor: '#F6FF78'
  },
  calendarContainer: {
    borderWidth: 1,
    backgroundColor: 'white',
    height: 400,
    paddingTop: 15
  },
});