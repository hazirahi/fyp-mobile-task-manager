import React from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Link, Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';

import { useAuth } from '@/provider/AuthProvider';

import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome6>['name'];
  color: string;
}) {
  return <FontAwesome6 size={28} style={{ marginBottom: -3 }} {...props} />;
}

function TabBarIconMat(props: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
}) {
  return <MaterialCommunityIcons size={32} style={{ marginBottom: -4 }} {...props} />;
}


const TabLayout = () => {
  const { signOut, session } = useAuth();

  return (
    <Tabs
      initialRouteName='home'
    >
      <Tabs.Screen
        name="timer"
        redirect={!session}
        options={{
          title: 'timer',
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <TabBarIconMat name="timer" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="notes"
        redirect={!session}
        options={{
          title: 'notes',
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <TabBarIconMat name="notebook" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="home"
        redirect={!session}
        options={{
          title: 'home',
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="house" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="calendar"
        redirect={!session}
        options={{
          title: 'calendar',
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar-days" color={color} />,
          headerShown: false,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'profile',
          tabBarShowLabel: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="user-circle" color={color} />,
          headerRight: () => (
            <TouchableOpacity onPress={signOut} style={{paddingRight: 10}}>
              <Ionicons name="log-out-outline" size={30} color={'black'} />
            </TouchableOpacity>
          ),
        //   headerShown: false,
        }}
      />
      <Tabs.Screen
        name="[id]"
        options={{
          href: null,
          tabBarShowLabel: false,
          headerShown: false,
        }}
        //look into this: https://reactnavigation.org/docs/bottom-tab-navigator/#options im so sleepy
      />
    </Tabs>
    
  );
};

export default TabLayout;
