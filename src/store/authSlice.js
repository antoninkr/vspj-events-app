import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import {
  makeRedirectUri,
  useAuthRequest,
  AuthRequest,
  useAutoDiscovery,
  exchangeCodeAsync,
  revokeAsync,
  ResponseType,
  resolveDiscoveryAsync,
  TokenResponse,
  TokenResponseConfig,
  TokenError,
} from 'expo-auth-session';
import Constants from 'expo-constants';
import { logoutUser } from './userSlice';

const clientId = Constants.expoConfig.extra.eventsApiOpenidConnectClientId;
const redirectUri = makeRedirectUri({
  scheme: Constants.expoConfig.scheme,
  path: 'redirect',
});

const initialState = {
  authorized: false,
  authorizationExpired: false,

  accessToken: null,
  idToken: null,
  refreshToken: null,
  scope: null,
  state: null,
  tokenType: null,
  issuedAt: null,
  expiresIn: null,

  shouldShowSuccessMessage: false,

  loading: false,
  error: '',
};

const getDiscovery = async () => {
  const discovery = await resolveDiscoveryAsync(
    Constants.expoConfig.extra.eventsApiOpenidConnectProviderUrl
  );
  return discovery;
};

/*
export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const response = selectTokenResponse(state);
    response.refreshAsync(response.getRequestConfig());
  }
);
*/

export const refreshIfNeeded = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const response = selectTokenResponse(state);
    const authorized = selectAuthorized(state);
    const authorizationExpired = selectAuthorizationExpired(state);
    if (!authorized) {
      throw new Error('Unauthorized User');
    } else if (!response.shouldRefresh() && response.refreshToken) {
      return;
    } else if (response.shouldRefresh()) {
      try {
        const tokenResponse = await response.refreshAsync(
          {
            refreshToken: response.refreshToken,
            clientId: response.clientId,
            responseType: ResponseType.Code,
            scopes: [
              'openid',
              'profile',
              'email',
              'offline_access',
              `api://${Constants.expoConfig.extra.eventsApiOpenidConnectClientId}/Identity.Read`,
            ],
            redirectUri,
            usePKCE: true,
          },
          await getDiscovery()
        );
        dispatch(authSlice.actions.refresh(tokenResponse.getRequestConfig()));
      } catch (err) {
        console.error('TokenError', err);
        if (err instanceof TokenError) {
          dispatch(authSlice.actions.authorizationExpired());
          console.warn('Authorization expired');
          throw new Error('Authorization expired');
        } else {
          console.warn('OAuth refresh network error');
          throw new Error('OAuth refresh network error');
        }
      }
    } else {
      console.error('Unknown OAuth refresh error');
      throw new Error('Unknown OAuth refresh error');
    }
  };
};

/*
 *  thunk function
 */
// const authenticateUser;
// lifecycle statuses of promise as actions - async action (action type, callback - contains async logic and returns promise) - generate pending, fulfilled and rejected action type
export const authenticateUser = createAsyncThunk(
  'auth/authenticateUser',
  async (_, thunkAPI) => {
    const request = new AuthRequest({
      clientId: clientId,
      responseType: ResponseType.Code,
      scopes: [
        'openid',
        'profile',
        'email',
        'offline_access',
        `api://${Constants.expoConfig.extra.eventsApiOpenidConnectClientId}/Identity.Read`,
      ],
      redirectUri,
      usePKCE: true,
    });

    try {
      const discovery = await getDiscovery();

      const response = await request.promptAsync(discovery, {
        useProxy: false,
      });

      if (response.type !== 'success') {
        throw new Error(response.type);
      }

      const exchangeFn = async (exchangeTokenReq) => {
        const exchangeTokenResponse = await exchangeCodeAsync(
          exchangeTokenReq,
          discovery
        );

        return exchangeTokenResponse;
      };

      const exchangeTokenResponse = await exchangeFn({
        clientId,
        code: response.params.code,
        redirectUri,
        extraParams: {
          code_verifier: request.codeVerifier,
        },
      });

      return exchangeTokenResponse.getRequestConfig();
    } catch (error) {
      console.warn(error.message);
      throw error;
    }
  }
);

const setTokenResponseConfigProperties = (state, action) => {
  state.accessToken = action.payload.accessToken;
  state.idToken = action.payload.idToken;
  state.refreshToken = action.payload.refreshToken;
  state.scope = action.payload.scope;
  state.state = action.payload.state;
  state.tokenType = action.payload.tokenType;
  state.issuedAt = action.payload.issuedAt;
  state.expiresIn = action.payload.expiresIn;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    refresh(state, action) {
      setTokenResponseConfigProperties(state, action);
      state.error = '';
      state.authorizationExpired = false;
    },
    authorizationExpired(state) {
      state.authorized = false;
      state.authorizationExpired = true;
      state.shouldShowSuccessMessage = false;
    },
    successMessageShowed(state) {
      state.shouldShowSuccessMessage = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authenticateUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(authenticateUser.fulfilled, (state, action) => {
      state.loading = false;

      setTokenResponseConfigProperties(state, action);

      state.authorized = true;
      state.authorizationExpired = false;
      state.error = '';
      state.shouldShowSuccessMessage = true;
    });
    builder.addCase(authenticateUser.rejected, (state, action) => {
      state.loading = false;
      state.authorized = false;
      if (action.error) {
        state.error = action.error.message;
      }
      state.shouldShowSuccessMessage = false;
    });

    builder.addCase(logoutUser.fulfilled, (state, action) => {
      Object.assign(state, initialState);
    });
  },
});

export const selectAuthorized = (state) => state.auth.authorized;
export const selectAuthorizationExpired = (state) =>
  state.auth.authorizationExpired;

export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIdToken = (state) => state.auth.idToken;
export const selectRefreshToken = (state) => state.auth.refreshToken;
export const selectScope = (state) => state.auth.scope;
export const selectState = (state) => state.auth.state;
export const selectTokenType = (state) => state.auth.tokenType;
export const selectIssuedAt = (state) => state.auth.issuedAt;
export const selectExpiresIn = (state) => state.auth.expiresIn;
export const selectError = (state) => state.auth.error;
export const selectLoading = (state) => state.auth.loading;

export const selectShouldShowSuccessMessage = (state) =>
  state.auth.shouldShowSuccessMessage;

export const selectTokenResponse = createSelector(
  [
    selectAuthorized,
    selectAccessToken,
    selectIdToken,
    selectRefreshToken,
    selectScope,
    selectState,
    selectTokenType,
    selectIssuedAt,
    selectExpiresIn,
  ],
  (
    authorized,
    accessToken,
    idToken,
    refreshToken,
    scope,
    state,
    tokenType,
    issuedAt,
    expiresIn
  ) => {
    if (!authorized) {
      return null;
    }
    return new TokenResponse({
      accessToken,
      idToken,
      refreshToken,
      scope,
      state,
      tokenType,
      issuedAt,
      expiresIn,
    });
  }
);

export const { refresh, authorizationExpired, successMessageShowed } =
  authSlice.actions;
export default authSlice.reducer;
