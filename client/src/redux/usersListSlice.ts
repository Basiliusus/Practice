import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export type UserShort = {
  _id: string;
  firstName: string;
  lastName: string;
  nickname: string;
  role: string;
  avatar?: string;
};

type UsersListState = {
  users: UserShort[];
  loading: boolean;
  error: string | null;
};

const initialState: UsersListState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsersList = createAsyncThunk(
  "usersList/fetchUsersList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", { withCredentials: true });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error fetching users");
    }
  }
);

const usersListSlice = createSlice({
  name: "usersList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersList.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default usersListSlice.reducer; 