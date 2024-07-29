import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { useEffect, useState } from "react";

import { LinearGradient } from "expo-linear-gradient";

export default function CalendarScreen() {
  
  const [selected, setSelected] = useState('');
  const [calMode, setCalMode] = useState('monthly');

  const calModes = {
    monthly: 'monthly',
    agenda: 'agenda',
    timeline: 'timeline'
};

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
          colors={['#A6F511', '#D5FF61', '#F6FF78', '#FFFFFF']}
          style={styles.background}
      />
      <View style={{paddingHorizontal: 20}}>
        <Text style={styles.header}>Calendar</Text>
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
        </View>
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
    paddingTop: 10,
    paddingBottom: 15
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
  }
});