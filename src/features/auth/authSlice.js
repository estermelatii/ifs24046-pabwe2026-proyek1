import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../config.js';
import { authenticateUser, fetchCurrentUser } from '../../services/authService.js';

export const authenticate = createAsyncThunk('auth/authenticate', async ({ mode, credentials }) => {
  const session = await authenticateUser(mode, credentials);
  localStorage.setItem(STORAGE_KEYS.token, session.token);
  return session.user;
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    return await fetchCurrentUser();
  } catch {
    localStorage.removeItem(STORAGE_KEYS.token);
    return rejectWithValue(null);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null },
  reducers: {
    clearUser(state) {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticate.fulfilled, (state, { payload }) => { state.user = payload; })
      .addCase(fetchMe.fulfilled, (state, { payload }) => { state.user = payload; });
  },
});

export const selectUser = (state) => state.auth.user;

export const logout = () => (dispatch) => {
  localStorage.removeItem(STORAGE_KEYS.token);
  dispatch(authSlice.actions.clearUser());
};

export default authSlice.reducer;
