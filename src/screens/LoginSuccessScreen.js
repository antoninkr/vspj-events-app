import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectError } from '../store/userSlice';
import { successMessageShowed } from '../store/authSlice';
import SuccessMessage from '../components/SuccessMessage';

const LoginSuccessScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const error = useSelector(selectError);

  return (
    <SuccessMessage
      messageText="Byl/a jste úspěšně přihášen/a pomocí účtu Microsoft."
      buttonText="Pokračovat"
      onButtonPress={() => {
        /*
        if (moodleAuthorized) {
          navigation.navigate('BottomTabsNavigator');
        } else {
          navigation.navigate('MoodleLoginScreen');
        }
        */
        dispatch(successMessageShowed());
      }}
    />
  );
};

const styles = StyleSheet.create({});

export default LoginSuccessScreen;
