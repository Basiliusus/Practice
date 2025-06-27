import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import postsReducer from './postsSlice';
import profileReducer from './profileSlice';
import usersListReducer from './usersListSlice';
import notificationsReducer from './notificationsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
    profile: profileReducer,
    usersList: usersListReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 