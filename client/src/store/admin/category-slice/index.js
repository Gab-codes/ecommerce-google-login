import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  categories: [],
};

const API_URL = import.meta.env.VITE_API_URL;

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  "/categories/fetchCategories",
  async () => {
    const result = await axios.get(`${API_URL}/api/admin/category/`);
    return result.data || [];
  }
);

// Add a new parent category
export const addCategory = createAsyncThunk(
  "/categories/addCategory",
  async (categoryName) => {
    const result = await axios.post(
      `${API_URL}/api/admin/category`,
      { name: categoryName },
      { headers: { "Content-Type": "application/json" } }
    );
    return result?.data;
  }
);

// Add a subcategory to a parent category
export const addSubcategory = createAsyncThunk(
  "/categories/addSubcategory",
  async ({ parentName, subcategoryName }) => {
    const result = await axios.post(
      `${API_URL}/api/admin/category/subcategory`,
      { parent: parentName, name: subcategoryName },
      { headers: { "Content-Type": "application/json" } }
    );
    return { parentName, subcategory: result?.data };
  }
);

// Update a parent category
export const updateCategory = createAsyncThunk(
  "/categories/updateCategory",
  async ({ oldName, newName }) => {
    const result = await axios.put(`${API_URL}/api/admin/category/${oldName}`, {
      name: newName,
    });
    return { oldName, newName, updatedCategory: result?.data };
  }
);

// Update a subcategory
export const updateSubcategory = createAsyncThunk(
  "/categories/updateSubcategory",
  async ({ parentName, oldSubName, newSubName }) => {
    const result = await axios.put(
      `${API_URL}/api/admin/category/${parentName}/subcategory/${oldSubName}`,
      { name: newSubName }
    );
    return { parentName, oldSubName, newSubName, updatedSub: result?.data };
  }
);

// Delete a parent category
export const deleteCategory = createAsyncThunk(
  "/categories/deleteCategory",
  async (categoryName) => {
    await axios.delete(`${API_URL}/api/admin/category/${categoryName}`);
    return categoryName;
  }
);

// Delete a subcategory
export const deleteSubcategory = createAsyncThunk(
  "/categories/deleteSubcategory",
  async ({ parentName, subcategoryName }) => {
    await axios.delete(
      `${API_URL}/api/admin/category/${parentName}/subcategory/${subcategoryName}`
    );
    return { parentName, subcategoryName };
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
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.isLoading = false;
        state.categories = [];
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push({
          ...action.payload,
          subcategories: action.payload.subcategories || [],
        });
      })
      .addCase(addSubcategory.fulfilled, (state, action) => {
        const updatedCategory = action.payload;
        const index = state.categories.findIndex(
          (cat) => cat.name === updatedCategory.name
        );
        if (index !== -1) {
          state.categories[index] = updatedCategory;
        }
      })
      .addCase(addSubcategory.rejected, (state) => {})
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (cat) => cat.name === action.payload.oldName
        );
        if (index !== -1) {
          state.categories[index].name = action.payload.newName;
        }
      })
      .addCase(updateSubcategory.fulfilled, (state, action) => {
        const parent = state.categories.find(
          (cat) => cat.name === action.payload.parentName
        );
        if (parent) {
          const subIndex = parent.subcategories.findIndex(
            (sub) => sub === action.payload.oldSubName
          );
          if (subIndex !== -1) {
            parent.subcategories[subIndex] = action.payload.newSubName;
          }
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (cat) => cat.name !== action.payload
        );
      })
      .addCase(deleteSubcategory.fulfilled, (state, action) => {
        const parent = state.categories.find(
          (cat) => cat.name === action.payload.parentName
        );
        if (parent) {
          parent.subcategories = parent.subcategories.filter(
            (sub) => sub !== action.payload.subcategoryName
          );
        }
      });
  },
});

export default AdminCategoriesSlice.reducer;
