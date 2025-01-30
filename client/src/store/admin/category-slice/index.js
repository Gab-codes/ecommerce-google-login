import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  categories: [],
};

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  "/categories/fetchCategories",
  async () => {
    const result = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/category/`
    );
    return result.data;
  }
);

// Add a new parent category
export const addCategory = createAsyncThunk(
  "/categories/addCategory",
  async (categoryName) => {
    const result = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/category`,
      { name: categoryName },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return result?.data;
  }
);

// Add a subcategory to a parent category
export const addSubcategory = createAsyncThunk(
  "/categories/addSubcategory",
  async ({ parentName, subcategoryName }) => {
    const result = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/category/subcategory`,
      { parent: parentName, name: subcategoryName },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return result?.data;
  }
);

// Delete a parent category
export const deleteCategory = createAsyncThunk(
  "/categories/deleteCategory",
  async (categoryName) => {
    const result = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/admin/category/${categoryName}`
    );
    return result?.data;
  }
);

// Delete a subcategory
export const deleteSubcategory = createAsyncThunk(
  "/categories/deleteSubcategory",
  async ({ parentName, subcategoryName }) => {
    const result = await axios.delete(
      `${
        import.meta.env.VITE_API_URL
      }/api/admin/category/${parentName}/subcategory/${subcategoryName}`
    );
    return result?.data;
  }
);

const AdminCategoriesSlice = createSlice({
  name: "adminCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.isLoading = false;
        state.categories = [];
      });
  },
});

export default AdminCategoriesSlice.reducer;
