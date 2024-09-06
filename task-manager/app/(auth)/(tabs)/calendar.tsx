import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { Agenda, Calendar, DateData, Timeline, TimelineEventProps } from "react-native-calendars";
import { useEffect, useState } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { useTaskList } from "@/provider/TaskListProvider";
import { Task } from "@/types/types";

export default function CalendarScreen() {
  const { tasks, getTasks } = useTaskList();

  const [items, setItems] = useState<any>({});
  const agendaItems: { [key: string]: any[]} = {};
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [selected, setSelected] = useState('');
  const [calMode, setCalMode] = useState('monthly');

  useEffect(() => {
    getTasks();
    agendaTasks();
  }, [tasks]);

  const timeToString = (time: Date) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  const agendaTasks = () => {
    const agendaItems: { [key: string]: any[]} = {};
    tasks.forEach((task: Task) => {
      if (task.due_date) {
        const dueDate = timeToString(task.due_date);
        if(!agendaItems[dueDate]) {
          agendaItems[dueDate] = [];
        }
        agendaItems[dueDate].push({
          name: task.task_name,
          description: task.task_description
        });
      }
    });
    setItems(agendaItems);
  }

  // const loadItems = (day: DateData) => {
  //   const items = {};

  //   setTimeout(() => {
  //     for (let i = -15; i < 85; i++) {
  //       const time = day.timestamp + i * 24 * 60 * 60 * 1000;
  //       const strTime = (time).toString;

  //       if (!items[strTime]) {
  //         items[strTime] = [];
  //       }
  //     }

      
  //   })
  // }

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
        {/* <View style={styles.calendarContainer}>
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
        */}

      </View>
      {/* <Agenda
        items={items}
        selectedDate={new Date()}
        renderItem={({ item }: { item: { name: string, description: string}}) => (
          <View>
            {item && (
              <View>
                <Text>{item.name}</Text>
                <Text>{item.description}</Text>
              </View>
            )}
            
          </View>
        )}
        renderEmptyDate={renderEmptyDate}
        onDayPress={(day: any) => setSelectedDate(day.date)}
        hideKnob={false}
        showClosingKnob={true}
        minDate={'2023-01-01'}
        maxDate={'2027-01-01'}
        loadItemsForMonth={loadItems}
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