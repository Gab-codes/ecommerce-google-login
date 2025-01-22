import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userList: [],
  isLoading: false,
  totalUsers: 0,
  totalPages: 0,
  error: null,
  userDetails: null,
};

export const getAllUsers = createAsyncThunk(
  "users/getAll",
  async ({ page, limit }) => {
    const response = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/api/admin/users/get?page=${page}&limit=${limit}`
    );
    return response.data;
  }
);

export const updateUserRole = createAsyncThunk(
  "users/update-role",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/users/update-role/${userId}`,
        { role }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Something went wrong. Please try again."
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/users/delete/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Something went wrong. Please try again."
      );
    }
  }
);

const allUserSlice = createSlice({
  name: "allUserSlice",
  initialState,
  reducers: {
    resetuserDetails: (state) => {
      state.userDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload.data;
        state.totalUsers = action.payload.totalUsers || 0;
        state.totalPages = action.payload.totalPages || 0;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.userList = [];
        state.error = action.error?.message || "Failed to fetch users";
      })
      .addCase(updateUserRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isLoading = false;
        const { userId, role } = action.meta.arg;
        const userIndex = state.userList.findIndex(
          (user) => user._id === userId
        );
        if (userIndex !== -1) {
          state.userList[userIndex].role = role;
        }
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update role";
      });
  },
});

export default allUserSlice.reducer;
