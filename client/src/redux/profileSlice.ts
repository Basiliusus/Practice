import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export type Project = {
  _id: string;
  title: string;
  description?: string;
  links: string[];
  previewImage?: string;
};

export type UserProfile = {
  _id: string;
  firstName: string;
  lastName: string;
  nickname: string;
  role: string;
  description?: string;
  workplace?: string;
  avatar?: string;
  portfolio: Project[];
};

type ProfileState = {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
};

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${id}`, { withCredentials: true });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error fetching profile");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "profile/updateUserProfile",
  async ({ id, data }: { id: string; data: Partial<UserProfile> }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/users/${id}`, data, { withCredentials: true });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error updating profile");
    }
  }
);

export const addProject = createAsyncThunk(
  "profile/addProject",
  async ({ id, data }: { id: string; data: Partial<Project> }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/users/${id}/portfolio`, data, { withCredentials: true });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error adding project");
    }
  }
);

export const updateProject = createAsyncThunk(
  "profile/updateProject",
  async ({ id, projectId, data }: { id: string; projectId: string; data: Partial<Project> }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/users/${id}/portfolio/${projectId}`, data, { withCredentials: true });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error updating project");
    }
  }
);

export const deleteProject = createAsyncThunk(
  "profile/deleteProject",
  async ({ id, projectId, title }: { id: string; projectId: string; title?: string }, { rejectWithValue }) => {
    try {
      if (!projectId || projectId === 'undefined') {
        await axios.post(`http://localhost:5000/api/users/${id}/portfolio/deleteByTitle`, { title }, { withCredentials: true });
        return null;
      } else {
        await axios.delete(`http://localhost:5000/api/users/${id}/portfolio/${projectId}`, { withCredentials: true });
        return projectId;
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error deleting project");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.portfolio.push(action.payload);
        }
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        if (state.profile) {
          const idx = state.profile.portfolio.findIndex(p => p._id === action.payload._id);
          if (idx !== -1) state.profile.portfolio[idx] = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        if (state.profile) {
          if (action.payload) {
            state.profile.portfolio = state.profile.portfolio.filter(p => p._id !== action.payload);
          } else if (action.meta && action.meta.arg && action.meta.arg.title) {
            state.profile.portfolio = state.profile.portfolio.filter(p => p.title !== action.meta.arg.title);
          }
        }
      });
  },
});

export default profileSlice.reducer; 