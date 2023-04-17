import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@rneui/themed';
import Spinner from 'react-native-loading-spinner-overlay';

const Loading = ({ text, loadingFailed, errorMessage }) => {
  return (
    <View style={styles.container}>
      {loadingFailed ? (
        <Text h4 style={styles.errorMessage}>
          {errorMessage}
        </Text>
      ) : null}

      <Spinner
        visible={!loadingFailed}
        textContent={text}
        textStyle={styles.spinnerTextStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  errorMessage: {
    color: 'red',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default Loading;
