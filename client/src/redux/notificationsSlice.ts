import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Notification {
  _id: string;
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

interface NotificationsState {
  notifications: Notification[];
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  error: null,
};

export const fetchNotifications = createAsyncThunk<Notification[], string>(
  'notifications/fetchNotifications',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/responses/notifications/${userId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки уведомлений');
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAllAsRead(state) {
      state.notifications = state.notifications.map(n => ({ ...n, isRead: true }));
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotifications.pending, state => {
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export default notificationsSlice.reducer;

export const selectUnreadCount = (state: { notifications: NotificationsState }) =>
  state.notifications.notifications.filter(n => !n.isRead).length;

export const { markAllAsRead } = notificationsSlice.actions; 