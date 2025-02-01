import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const response = await axios.get(`${API_URL}/api/admin/category/`);
    return response.data;
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default categorySlice.reducer;
