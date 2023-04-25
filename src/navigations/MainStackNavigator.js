import React, { useEffect, useState } from 'react';
import LoginSuccessScreen from '../screens/LoginSuccessScreen';
import MoodleLoginScreen from '../screens/MoodleLoginScreen';
import EventTypesSettingsScreen from '../screens/EventTypesSettingsScreen';
import EventsTopTabNavigator from './EventsTopTabNavigator';
import BottomTabsNavigator from './BottomTabsNavigator';
import LoadingScreen from '../screens/LoadingScreen';
import { selectFirstSynchronizationMade } from '../store/userSlice';

import { createStackNavigator } from '@react-navigation/stack';

import { useDispatch, useSelector } from 'react-redux';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { sync } from '../model/synchronization';

import {
  selectShouldShowSuccessMessage,
  selectMoodleShouldShowSuccessMessage,
} from '../store/authSlice';
import MoodleLoginSuccessScreen from '../screens/MoodleLoginSuccessScreen';
import {
  firstSynchronizationSucceeded,
  selectEventTypesSelected,
} from '../store/userSlice';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  const dispatch = useDispatch();

  const shouldShowSuccessMessage = useSelector((state) =>
    selectShouldShowSuccessMessage(state)
  );
  const shouldMoodleShowSuccessMessage = useSelector((state) =>
    selectMoodleShouldShowSuccessMessage(state)
  );
  const eventTypesSelected = useSelector((state) =>
    selectEventTypesSelected(state)
  );

  const firstSynchronizationMade = useSelector((state) =>
    selectFirstSynchronizationMade(state)
  );

  const database = useDatabase();

  const [synchronizationEnded, setSynchronizationEnded] = useState(false);

  useEffect(() => {
    const synchronize = async () => {
      try {
        await sync(database);
      } catch (err) {
        console.log(err);
        console.error(
          `An error occurred while attempting to synchronize WatermelonDB.`
        );
      }
      setSynchronizationEnded(true);
      dispatch(firstSynchronizationSucceeded());
    };
    synchronize();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {shouldShowSuccessMessage ? (
        <Stack.Screen
          name="LoginSuccessScreen"
          component={LoginSuccessScreen}
        />
      ) : null}

      {shouldMoodleShowSuccessMessage ? (
        <Stack.Screen
          name="LoginSuccessScreen"
          component={MoodleLoginSuccessScreen}
        />
      ) : null}
      {synchronizationEnded || firstSynchronizationMade ? null : (
        <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
      )}
      {eventTypesSelected ? null : (
        <Stack.Screen
          name="EventTypesSettingsScreen"
          component={EventTypesSettingsScreen}
        />
      )}
      <Stack.Screen
        name="BottomTabsNavigator"
        component={BottomTabsNavigator}
      />

      <Stack.Screen
        name="EventTypesSettingsScreen2"
        component={EventTypesSettingsScreen}
      />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
