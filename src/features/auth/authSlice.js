import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../helpers/api.js';

export const authenticate = createAsyncThunk('auth/authenticate', async ({ mode, body }) => {
  const r = await api('/api/auth/' + mode, { method: 'POST', body });
  localStorage.setItem('fg-token', r.token);
  return r.user;
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    return await api('/api/auth/me');
  } catch {
    localStorage.removeItem('fg-token');
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

export const logout = () => (dispatch) => {
  localStorage.removeItem('fg-token');
  dispatch(authSlice.actions.clearUser());
};
export default authSlice.reducer;
