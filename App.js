import React, { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { useWatermelonDB } from './src/hooks/useWatermelonDB';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import store from './src/store/store';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import {
  selectAuthorized,
  refreshIfNeeded,
  selectTokenResponse,
  selectAccessToken,
  selectMoodleUserToken,
  selectMoodleAuthorized,
} from './src/store/authSlice';
import { NavigationContainer } from '@react-navigation/native';
import MainStackNavigator from './src/navigations/MainStackNavigator';
import LoginStackNavigator from './src/navigations/LoginStackNavigator';
import DBErrorScreen from './src/screens/DBErrorScreen';
import { getEvents } from './src/api/VSPJEvents';
import { useBackgroundFetch } from './src/hooks/useBackgroundFetch';

WebBrowser.maybeCompleteAuthSession();

const App = () => {
  const dispatch = useDispatch();

  const [status, isRegistered, toggleFetchTask] = useBackgroundFetch();
  useEffect(() => {
    if (!isRegistered) {
      toggleFetchTask();
    }
  }, [isRegistered]);

  const authorized = useSelector((state) => selectAuthorized(state));
  const moodleAuthorized = useSelector((state) =>
    selectMoodleAuthorized(state)
  );
  const authTokenResponse = useSelector((state) => selectTokenResponse(state));

  useEffect(() => {
    if (authorized) {
      dispatch(refreshIfNeeded()).catch((err) => {
        console.log(`User isn't logged in.`, err.message);
      });
    }
  }, [authTokenResponse]);

  return (
    <NavigationContainer>
      {authorized && moodleAuthorized ? (
        <MainStackNavigator />
      ) : (
        <LoginStackNavigator />
      )}
    </NavigationContainer>
  );
};

export default () => {
  let [database] = useWatermelonDB();

  let persistor = persistStore(store);

  return database ? (
    <DatabaseProvider database={database}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </DatabaseProvider>
  ) : (
    <DBErrorScreen />
  );
};
