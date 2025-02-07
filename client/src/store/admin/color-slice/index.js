import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  colors: [],
  error: null,
};

const API_URL = import.meta.env.VITE_API_URL;

// Fetch all colors
export const fetchColors = createAsyncThunk(
  "colors/fetchColors",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/color/`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch colors"
      );
    }
  }
);

// Add a new color
export const addColor = createAsyncThunk(
  "colors/addColor",
  async ({ colorName, colorValue }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/admin/color/add`,
        { name: colorName, value: colorValue },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add color"
      );
    }
  }
);

// Delete color
export const deleteColor = createAsyncThunk(
  "colors/deleteColor",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/api/admin/color/delete/${id}`);
      return id; // Return the ID so we can remove it from the state
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete color"
      );
    }
  }
);

const colorSlice = createSlice({
  name: "colors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch colors
      .addCase(fetchColors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchColors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.colors = action.payload;
      })
      .addCase(fetchColors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add color
      .addCase(addColor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addColor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.colors.push(action.payload);
      })
      .addCase(addColor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete color
      .addCase(deleteColor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteColor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.colors = state.colors.filter(
          (color) => color._id !== action.payload
        );
      })
      .addCase(deleteColor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default colorSlice.reducer;
