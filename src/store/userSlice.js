import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getLoggedInUser } from './../api/VSPJEvents';
const initialState = {
  rc: '',
  email: '',
  firstName: '',
  lastName: '',

  loaded: false,
  loading: false,
  error: '',
};

export const fetchLoggedInUser = createAsyncThunk(
  'user/fetchLoggedInUser',
  async (_, thunkAPI) => {
    try {
      const response = await getLoggedInUser();
      return response.data;
    } catch (error) {
      let e = '';
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        e = 'error.response';
        console.log('error.response.data: ', error.response.data);
        console.log('error.response.status: ', error.response.status);
        console.log('error.response.headers: ', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        e = error.request;
        console.log('error.request', error.request);
      } else {
        e = 'else';
        // Something happened in setting up the request that triggered an Error
        console.log('error.message', error.message);
      }
      throw new Error(error.message);

      // return thunkAPI.rejectWithValue('aaaaaaaaaaaa');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async ({ database }, thunkAPI) => {
    await database.write(async () => {
      await database.unsafeResetDatabase();
    });
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchLoggedInUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchLoggedInUser.fulfilled, (state, action) => {
      state.loading = false;

      // if (action.payload) {
      state.rc = action.payload.rc;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      // }
      state.loaded = true;
      state.error = '';
    });
    builder.addCase(fetchLoggedInUser.rejected, (state, action) => {
      state.loading = false;
      //   state.users = [];
      state.error = action.error.message; // if throw new error
      // state.error = action.payload; // thunkAPI.rejectWithValue
    });

    builder.addCase(logoutUser.fulfilled, (state, action) => {
      Object.assign(state, initialState);
    });

    builder.addCase(logoutUser.rejected, (state, action) => {
      console.error('logoutUser.rejected');
      console.log(action);
    });
  },
});

export const selectLoading = (state) => state.user.loading;
export const selectLoaded = (state) => state.user.loaded;
export const selectRc = (state) => state.user.rc;
export const selectEmail = (state) => state.user.email;
export const selectFirstName = (state) => state.user.firstName;
export const selectLastName = (state) => state.user.lastName;
export const selectError = (state) => state.user.error;

export default userSlice.reducer;
