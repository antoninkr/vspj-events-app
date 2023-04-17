import React from 'react';
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, Input, Button } from '@rneui/themed';
import Spacer from '../components/Spacer';
import { Formik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  username: Yup.string().required('Zadejte uživatelské jméno!'),
  password: Yup.string().required('Zadejte heslo!'),
});

const MoodleLoginForm = ({ onSubmit, errorMessage }) => {
  const { height } = useWindowDimensions();
  const smallScreen = height < 600;
  console.log('height', height);
  const userInfo = {
    username: '',
    password: '',
  };

  return (
    <Formik
      initialValues={userInfo}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => {
        const { username, password } = values;
        return (
          <View style={{ flex: 1 }}>
            <View style={{ flex: 10, marginTop: 10, alignItems: 'center' }}>
              <Text h3={!smallScreen} h4={smallScreen} style={{}}>
                Přihlášení Moodle
              </Text>
            </View>
            <View style={styles.container}>
              {!smallScreen ? (
                <Image
                  source={require('./../../assets/logo-moodle.png')}
                  fadeDuration={0}
                  style={{
                    width: 225,
                    height: 53,
                    alignSelf: 'center',
                    marginTop: 20,
                  }}
                />
              ) : null}
              <View style={styles.formContainer}>
                <Input
                  label={smallScreen ? null : 'Uživatelské jméno'}
                  value={username}
                  errorMessage={touched.username && errors.username}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  autoCapitalize="none"
                  autoCorrect={false}
                  errorStyle={{ fontSize: 16, marginTop: 15 }}
                  placeholder={smallScreen ? 'Uživatelské jméno' : null}
                />
                <Input
                  secureTextEntry
                  label={smallScreen ? null : 'Heslo'}
                  value={password}
                  errorMessage={touched.password && errors.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  autoCapitalize="none"
                  autoCorrect={false}
                  errorStyle={{ fontSize: 16, marginTop: 15 }}
                  placeholder={smallScreen ? 'Heslo' : null}
                />
                <Text style={{ ...styles.errorMessage, marginBottom: 15 }}>
                  {errorMessage}
                </Text>

                <Button
                  title="Přihlásit se"
                  onPress={isSubmitting ? null : handleSubmit}
                  loading={isSubmitting}
                />
              </View>
              <View></View>
            </View>
          </View>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 90,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  formContainer: {
    width: '95%',
    paddingHorizontal: 4,
    justifyContent: 'space-between',
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    margin: 10,
    alignSelf: 'center',
  },
});

export default MoodleLoginForm;
