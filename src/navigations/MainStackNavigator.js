import React, { useEffect } from 'react';
import LoginSuccessScreen from '../screens/LoginSuccessScreen';
import MoodleLoginScreen from '../screens/MoodleLoginScreen';
import EventTypesSettingsScreen from '../screens/EventTypesSettingsScreen';
import EventsTopTabNavigator from './EventsTopTabNavigator';
import BottomTabsNavigator from './BottomTabsNavigator';

import { createStackNavigator } from '@react-navigation/stack';

import { useDispatch, useSelector } from 'react-redux';

import { fetchLoggedInUser } from '../store/userSlice';
import { selectShouldShowSuccessMessage } from '../store/authSlice';
import { selectAuthorized } from '../store/moodleAuthSlice';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLoggedInUser());
  }, []);

  const shouldShowSuccessMessage = useSelector((state) =>
    selectShouldShowSuccessMessage(state)
  );
  const moodleAuthorized = useSelector((state) => selectAuthorized(state));

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {shouldShowSuccessMessage ? (
        <Stack.Screen
          name="LoginSuccessScreen"
          component={LoginSuccessScreen}
        />
      ) : null}

      <Stack.Screen
        name="EventTypesSettingsScreen"
        component={EventTypesSettingsScreen}
      />
      <Stack.Screen
        name="BottomTabsNavigator"
        component={BottomTabsNavigator}
      />
      <Stack.Screen name="MoodleLoginScreen" component={MoodleLoginScreen} />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
