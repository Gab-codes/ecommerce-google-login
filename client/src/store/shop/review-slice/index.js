import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  reviews: [],
};

export const addReview = createAsyncThunk(
  "/order/addReview",
  async (formdata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/review/add`,
        formdata
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        // Reject with the custom message from the backend
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

export const getReviews = createAsyncThunk("/order/getReviews", async (id) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/shop/review/${id}`
  );
  return response.data;
});

const reviewSlice = createSlice({
  name: "reviewSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle successful review submission (optional)
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        // Log the error for debugging
        console.error("Error in addReview:", action.payload || action.error.message);
      })
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
        state.reviews = [];
      });
  },
});

export default reviewSlice.reducer;
