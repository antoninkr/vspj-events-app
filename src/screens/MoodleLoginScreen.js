import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Input, Button } from '@rneui/themed';
import * as Yup from 'yup';
import MoodleLogin from '../components/MoodleLogin';
import SuccessMessage from '../components/SuccessMessage';
import { SafeAreaView } from 'react-native';
import { useSelector } from 'react-redux';
import {
  selectAuthorizationExpired,
  selectAuthorized,
  selectUserToken,
} from '../store/moodleAuthSlice';
import { useNavigation } from '@react-navigation/native';

const MoodleLoginScreen = () => {
  const navigation = useNavigation();
  const userToken = useSelector((state) => selectUserToken(state));
  // const authorizationExpired = useSelector((state) =>
  //   selectAuthorizationExpired(state)
  // );
  const authorized = useSelector((state) => selectAuthorized(state));

  // const loggedIn = userToken && !authorizationExpired;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {authorized ? (
        <SuccessMessage
          messageText={'Byl/a jste úspěšně přihlášen/a do VŠPJ Moodle'}
          buttonText="Pokračovat"
          onButtonPress={() => {
            navigation.navigate('BottomTabsNavigator');
          }}
        />
      ) : (
        <MoodleLogin />
      )}
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
