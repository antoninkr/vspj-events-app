import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsScreen from '../screens/SettingsScreen';
import EventsTopTabNavigator from './EventsTopTabNavigator';
import { Feather, Ionicons, AntDesign } from '@expo/vector-icons';
import CalendarScreen from '../screens/CalendarScreen';
import { sync } from '../model/synchronization';
import { useDatabase } from '@nozbe/watermelondb/hooks';

const Tab = createBottomTabNavigator();

const BottomTabsNavigator = () => {
  const database = useDatabase();

  useEffect(() => {
    const interval = setInterval(() => {
      const synchronize = async () => {
        try {
          await sync(database);
        } catch (err) {
          console.log(err);
          console.warn(
            `An error occurred while attempting to synchronize WatermelonDB.`
          );
        }
      };
      synchronize();

      console.log('This will run every 5 minutes!');
    }, 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, []);

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
