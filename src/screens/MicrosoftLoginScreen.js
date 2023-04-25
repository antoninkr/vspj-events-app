import { Button, Text } from '@rneui/base';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import MicrosoftButton from '../components/buttons/MicrosoftButton';
import { authenticateUser, selectLoading } from '../store/authSlice';

const MicrosoftLoginScreen = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const loading = useSelector((state) => selectLoading(state));

  const dispatch = useDispatch();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text h2 style={{ flex: 20 }}>
          Přihlášení Microsoft
        </Text>
        {loading ? (
          <Text h4 style={{ flex: 20 }}>
            Počkejte, prosím, budete přesměrováni na přihlášení Microsoft.
          </Text>
        ) : (
          <>
            <Text h4 style={{ flex: 20 }}>
              Přihlaste se prosím pomocí Vašeho VŠPJ účtu Microsoft.
            </Text>
            <View style={{ flex: 20 }}>
              <MicrosoftButton
                title="Přihlásit se"
                onPress={() => {
                  dispatch(authenticateUser());
                }}
              />
            </View>
          </>
        )}
        <View style={{ flex: 20 }}></View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
});

export default MicrosoftLoginScreen;
