import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Divider } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  logoutUser,
  selectEmail,
  selectFirstName,
  selectLastName,
  selectRc,
} from '../store/userSlice';

import { useDatabase } from '@nozbe/watermelondb/hooks';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const firstName = useSelector((state) => selectFirstName(state));
  const lastName = useSelector((state) => selectLastName(state));
  const email = useSelector((state) => selectEmail(state));
  const rc = useSelector((state) => selectRc(state));

  const database = useDatabase();

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Text h4>Přihlášený uživatel</Text>
        <View style={styles.row}>
          <Text style={styles.lable}>RC:</Text>
          <Text style={styles.value}>{rc}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.lable}>Jméno:</Text>
          <Text style={styles.value}>
            {firstName} {lastName}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.lable}>Email:</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
      </View>
      <Button
        onPress={() => {
          dispatch(logoutUser({ database }));
        }}
        containerStyle={styles.eventTypesBtn}
        title="Odhlásit se"
      />
      <Divider style={{ marginVertical: 8 }} />
      <Button
        onPress={() => {
          navigation.navigate('EventTypesSettingsScreen2');
        }}
        containerStyle={styles.eventTypesBtn}
        title="Nastavení typů událostí"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    margin: 8,
  },

  row: {
    // flexDirection: 'row',
    // gap: 10,
  },

  lable: { fontWeight: 'bold', fontSize: 15, margin: 4 },
  value: { fontSize: 16, marginLeft: 8, textAlign: 'justify' },
  eventTypesBtn: { maxWidth: '80%', alignSelf: 'center', marginVertical: 8 },
  userContainer: { marginHorizontal: 4, marginVertical: 8 },
});

export default SettingsScreen;
