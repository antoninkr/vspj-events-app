import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from '../screens/SettingsScreen';
import EventsTopTabNavigator from './EventsTopTabNavigator';
import { Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import CalendarScreen from '../screens/CalendarScreen';

const Tab = createBottomTabNavigator();

const BottomTabsNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Program"
        component={EventsTopTabNavigator}
        options={{
          headerTitle: 'Program',
          tabBarLabel: 'Program',
          tabBarIcon: ({ color, size }) => (
            <Feather name="list" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="CalendarScreen"
        component={CalendarScreen}
        options={{
          headerTitle: 'Kalendář',
          tabBarLabel: 'Kalendář',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="calendar" size={24} color="black" />
          ),
        }}
      />
      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          headerTitle: 'Nastavení',
          tabBarLabel: 'Nastavení',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={24} color="black" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabsNavigator;
