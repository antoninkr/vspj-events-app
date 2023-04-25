import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Input, Button } from '@rneui/themed';
import * as Yup from 'yup';
import MoodleLogin from '../components/MoodleLogin';
import SuccessMessage from '../components/SuccessMessage';
import { SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';

import {
  selectMoodleAuthorizationExpired,
  selectMoodleAuthorized,
  selectMoodleUserToken,
} from '../store/authSlice';
import { useNavigation } from '@react-navigation/native';

const MoodleLoginScreen = () => {
  const navigation = useNavigation();
  const userToken = useSelector((state) => selectMoodleUserToken(state));
  // const authorizationExpired = useSelector((state) =>
  //   selectMoodleAuthorizationExpired(state)
  // );

  // const loggedIn = userToken && !authorizationExpired;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MoodleLogin />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   // justifyContent: 'center',
  //   marginBottom: 300,
  // },
});

export default MoodleLoginScreen;
