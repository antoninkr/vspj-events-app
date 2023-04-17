import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, Input, Button } from '@rneui/themed';
import { View } from 'react-native';

const DBErrorScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText} h4>
        Nastala chyba připojení k databázi WatermelonDB.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export default DBErrorScreen;
