import React from 'react';

import MicrosoftLoginScreen from '../screens/MicrosoftLoginScreen';
import SignupScreen from '../screens/MoodleLoginScreen';

import { createStackNavigator } from '@react-navigation/stack';
import { selectAuthorized } from '../store/authSlice';

const Stack = createStackNavigator();

const LoginStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="MicrosoftLoginScreen"
        component={MicrosoftLoginScreen}
        options={{ title: 'Příhlášení' }}
      />
    </Stack.Navigator>
  );
};

export default LoginStackNavigator;
