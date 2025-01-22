import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImageList: [],
};

export const getFeatureImages = createAsyncThunk(
  "/order/getFeatureImages",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/common/feature/get`
    );

    return response.data;
  }
);

export const addFeatureImage = createAsyncThunk(
  "/order/addFeatureImage",
  async (image) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/common/feature/add`,
      { image }
    );

    return response.data;
  }
);

export const deleteFeatureImage = createAsyncThunk(
  "/order/deleteFeatureImage",
  async (id, { dispatch }) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/common/feature/delete/${id}`);
    
    dispatch(getFeatureImages());
    
    return id;
  }
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      })
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        state.featureImageList.push(action.payload.data);
      })
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        state.featureImageList = state.featureImageList.filter(
          (image) => image._id !== action.payload
        );
      });
  },
});

export default commonSlice.reducer;
