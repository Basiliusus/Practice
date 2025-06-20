import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

type User = {
  id: string;
  nickname: string;
  role: string;
  token: string;
};

type UserState = {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
};

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  error: null,
};

export const register = createAsyncThunk(
  'user/register',
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:5000/api/register', data, { withCredentials: true });
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', data, { withCredentials: true });
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('http://localhost:5000/api/profile', { withCredentials: true });
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(null);
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'user/logoutAsync',
  async () => {
    await axios.post('http://localhost:5000/api/logout', {}, { withCredentials: true });
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      });
  }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer; 