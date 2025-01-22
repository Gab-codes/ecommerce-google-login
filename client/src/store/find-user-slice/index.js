import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getUserById = createAsyncThunk(
  "/user/getUserById",
  async (userId, { rejectWithValue }) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/user/${userId}`);
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data); 
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; 
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; 
      });
  },
});

export const { actions, reducer } = userSlice;
export default reducer;
