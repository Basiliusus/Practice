import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export type PostAuthor = {
  _id: string;
  nickname: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  author: PostAuthor | string;
  type: 'Контент' | 'Событие' | 'Вакансия';
  direction: string;
  likes: number;
  isLikedByUser: boolean;
  previewImage?: string;
};

export type PostsState = {
  posts: Post[];
  loading: boolean;
  error: string | null;
  filter: {
    type?: string;
    direction?: string;
  };
};

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  filter: {},
};

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (filter: { type?: string; direction?: string } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filter.type) params.append('type', filter.type);
      if (filter.direction) params.append('direction', filter.direction);
      const res = await axios.get(`http://localhost:5000/api/posts?${params.toString()}`, { withCredentials: true });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка загрузки постов');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (data: any, { rejectWithValue }) => {
    try {
      const res = await axios.post('http://localhost:5000/api/posts', data, { withCredentials: true });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка создания поста');
    }
  }
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/posts/${id}`, data, { withCredentials: true });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка обновления поста');
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${id}`, { withCredentials: true });
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка удаления поста');
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/likePost',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/posts/${id}/like`, {}, { withCredentials: true });
      return { id, likes: res.data.likes };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка лайка');
    }
  }
);

export const unlikePost = createAsyncThunk(
  'posts/unlikePost',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/posts/${id}/like`, { withCredentials: true });
      return { id, likes: res.data.likes };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Ошибка снятия лайка');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<{ type?: string; direction?: string }>) {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.map((post: any) => ({
          ...post,
          id: post._id,
          isLikedByUser: post.likedBy?.some((u: any) => u === post.currentUserId),
        }));
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift({ ...action.payload, id: action.payload._id, isLikedByUser: false });
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        const idx = state.posts.findIndex((p) => p.id === action.payload._id);
        if (idx !== -1) state.posts[idx] = { ...action.payload, id: action.payload._id };
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p.id !== action.payload);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const idx = state.posts.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) {
          state.posts[idx].likes = action.payload.likes;
          state.posts[idx].isLikedByUser = true;
        }
      })
      .addCase(unlikePost.fulfilled, (state, action) => {
        const idx = state.posts.findIndex((p) => p.id === action.payload.id);
        if (idx !== -1) {
          state.posts[idx].likes = action.payload.likes;
          state.posts[idx].isLikedByUser = false;
        }
      });
  },
});

export const { setFilter } = postsSlice.actions;
export default postsSlice.reducer; 