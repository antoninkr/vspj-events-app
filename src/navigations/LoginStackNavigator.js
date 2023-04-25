import React from 'react';

import MicrosoftLoginScreen from '../screens/MicrosoftLoginScreen';
import MoodleLoginScreen from '../screens/MoodleLoginScreen';
import LoginSuccessScreen from '../screens/LoginSuccessScreen';

import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import {
  selectAuthorized,
  selectMoodleAuthorized,
  selectShouldShowSuccessMessage,
} from '../store/authSlice';

const Stack = createStackNavigator();

const LoginStackNavigator = () => {
  const shouldShowSuccessMessage = useSelector((state) =>
    selectShouldShowSuccessMessage(state)
  );
  const moodleAuthorized = useSelector((state) =>
    selectMoodleAuthorized(state)
  );
  const authorized = useSelector((state) => selectAuthorized(state));

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {authorized ? null : (
        <Stack.Screen
          name="MicrosoftLoginScreen"
          component={MicrosoftLoginScreen}
          options={{ title: 'Příhlášení' }}
        />
      )}
      {shouldShowSuccessMessage ? (
        <Stack.Screen
          name="LoginSuccessScreen"
          component={LoginSuccessScreen}
        />
      ) : null}
      {moodleAuthorized ? null : (
        <Stack.Screen name="MoodleLoginScreen" component={MoodleLoginScreen} />
      )}
    </Stack.Navigator>
  );
};

export default LoginStackNavigator;
