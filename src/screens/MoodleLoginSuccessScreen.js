import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { selectError } from '../store/userSlice';
import { moodleSuccessMessageShowed } from '../store/authSlice';
import SuccessMessage from '../components/SuccessMessage';

const MoodleLoginSuccessScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const error = useSelector(selectError);

  return (
    <SuccessMessage
      messageText={'Byl/a jste úspěšně přihlášen/a do VŠPJ Moodle'}
      buttonText="Pokračovat"
      onButtonPress={() => {
        /*
        if (moodleAuthorized) {
          navigation.navigate('BottomTabsNavigator');
        } else {
          navigation.navigate('MoodleLoginScreen');
        }
        */
        dispatch(moodleSuccessMessageShowed());
      }}
    />
  );
};

const styles = StyleSheet.create({});

export default MoodleLoginSuccessScreen;
