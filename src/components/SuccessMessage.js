import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Text, Button } from '@rneui/themed';
import Spacer from './Spacer';
import BlackButton from './buttons/BlackButton';

const SuccessMessage = ({ messageText, buttonText, onButtonPress }) => {
  return (
    <View style={styles.container}>
      <Text h2>{messageText}</Text>
      <Spacer />
      <AntDesign name="checkcircleo" size={180} color="#787878" />
      <Spacer />
      <BlackButton title={buttonText} onPress={onButtonPress} />
      <Spacer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default SuccessMessage;
