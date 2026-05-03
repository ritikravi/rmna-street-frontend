import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

const user = JSON.parse(localStorage.getItem('rmna_user') || 'null');
const token = localStorage.getItem('rmna_token') || null;

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/register', data);
    // No token returned — must verify OTP first
    return { ...res.data, pendingVerification: true };
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (data, { dispatch, rejectWithValue }) => {
  try {
    const res = await api.post('/auth/login', data);
    // Merge guest cart after login
    const { mergeGuestCart } = await import('../slices/cartSlice');
    setTimeout(() => dispatch(mergeGuestCart()), 100);
    return res.data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Login failed');
  }
});

export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/auth/profile');
    return res.data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user, token, loading: false, error: null, pendingEmail: null, pendingToken: null },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.pendingEmail = null;
      state.pendingToken = null;
      localStorage.removeItem('rmna_user');
      localStorage.removeItem('rmna_token');
    },
    clearError(state) { state.error = null; },
    // Called after OTP verified — complete the login
    completeLogin(state) {
      if (state.pendingToken) {
        const storedUser = JSON.parse(localStorage.getItem('rmna_pending_user') || 'null');
        state.token = state.pendingToken;
        state.user = storedUser;
        state.pendingToken = null;
        state.pendingEmail = null;
        localStorage.setItem('rmna_token', state.token);
        if (storedUser) localStorage.setItem('rmna_user', JSON.stringify(storedUser));
        localStorage.removeItem('rmna_pending_user');
      }
    },
  },
  extraReducers: (builder) => {
    const handleAuth = (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('rmna_user', JSON.stringify(action.payload.user));
      localStorage.setItem('rmna_token', action.payload.token);
    };
    builder
      .addCase(register.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(register.fulfilled, (s, a) => {
        s.loading = false;
        if (a.payload.pendingVerification) {
          s.pendingEmail = a.payload.user?.email;
          s.pendingToken = a.payload.token;
          // Store user temporarily
          localStorage.setItem('rmna_pending_user', JSON.stringify(a.payload.user));
          return;
        }
        handleAuth(s, a);
      })
      .addCase(register.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(login.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(login.fulfilled, handleAuth)
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(getProfile.fulfilled, (s, a) => { s.user = a.payload.user; });
  },
});

export const { logout, clearError, completeLogin } = authSlice.actions;
export default authSlice.reducer;
