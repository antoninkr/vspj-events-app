import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import authReducer from './authSlice';
import moodleReducer from './moodleAuthSlice';
import userReducer from './userSlice';

import { combineReducers } from 'redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import AsyncStorage from 'redux-persist/lib/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import createSecureStore from 'redux-persist-expo-securestore';
import createSecureStore from '@neverdull-agency/expo-unlimited-secure-store';

// const logger = reduxLogger.createLogger();

// <pridano>

const secureStorage = createSecureStore();

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['auth', 'moodleAuth'],
  timeout: null,
};

const authPersistConfig = {
  key: 'auth',
  storage: secureStorage,
  // blacklist: ['somethingTemporary']
};

const moodleAuthPersistConfig = {
  key: 'moodleAuth',
  storage: secureStorage,
  // blacklist: ['somethingTemporary']
};

const reducers = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  moodleAuth: persistReducer(moodleAuthPersistConfig, moodleReducer),
  user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

// </pridano>

// combineReducers
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }), // .concat(logger)
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

const unsubscribe = store.subscribe(() => {
  // console.log('Updated state ', store.getState());
});

export default store;
