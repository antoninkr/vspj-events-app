import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';

import Constants from 'expo-constants';
import { getUserToken } from '../api/Moodle';
import { logoutUser } from './userSlice';

const initialState = {
  authorizationExpired: false,
  userToken: null,
};

export const authenticateUser = (username, password) => {
  return async (dispatch, getState) => {
    try {
      const response = await getUserToken(username, password);
      if (response.error) {
        throw new Error(response.error);
      } else if (response.token) {
        dispatch(dispatch(moodleAuthSlice.actions.authenticate(response)));
      } else {
        throw new Error('Někde nastala chyba, omlouváme se.');
      }
    } catch (error) {
      if (!error.response && error.code === 'ERR_NETWORK') {
        throw new Error('Chyba připojení k Internetu.');
      }
      throw error;
    }
  };
};

const moodleAuthSlice = createSlice({
  name: 'moodleAuth',
  initialState,
  reducers: {
    authenticate(state, action) {
      state.userToken = action.payload.token;
      state.authorizationExpired = false;
    },
    authorizationExpired(state) {
      state.authorizationExpired = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      Object.assign(state, initialState);
    });
  },
});

export const selectUserToken = (state) => state.moodleAuth.userToken;
export const selectAuthorizationExpired = (state) =>
  state.moodleAuth.authorizationExpired;

export const selectAuthorized = createSelector(
  [selectUserToken, selectAuthorizationExpired],
  (userToken, authorizationExpired) => {
    return userToken && !authorizationExpired;
  }
);

export default moodleAuthSlice.reducer;
