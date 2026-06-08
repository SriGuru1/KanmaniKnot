import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axios.post('/api/auth/login', credentials, { withCredentials: true });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Login failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
  } catch (err) {
    return rejectWithValue(err.response?.data?.error);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, accessToken: null, loading: false, error: null },
  reducers: {
    setAccessToken: (state, action) => { state.accessToken = action.payload; },
    logout: (state) => { state.user = null; state.accessToken = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; state.accessToken = null; });
  },
});

export const { setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
