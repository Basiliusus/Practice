import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

type User = {
  id: string;  _id?: string;
  nickname: string;
  role: string;
  token: string;
};

type UserState = {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
  loading: boolean;
  initialized: boolean;
};

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  error: null,
  loading: false,
  initialized: false,
};

export const register = createAsyncThunk(
  "user/register",
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      await axios.post("http://localhost:5000/api/register", data, {
        withCredentials: true,
      });
      const profile = await dispatch(fetchProfile()).unwrap();
      return profile;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      await axios.post("http://localhost:5000/api/login", data, {
        withCredentials: true,
      });
      const profile = await dispatch(fetchProfile()).unwrap();
      return profile;
    } catch (err: any) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/api/profile", {
        withCredentials: true,
      });
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(null);
    }
  }
);

export const logoutAsync = createAsyncThunk("user/logoutAsync", async () => {
  await axios.post(
    "http://localhost:5000/api/logout",
    {},
    { withCredentials: true }
  );
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(logoutAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
        state.loading = false;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
