import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDashboardMetrics = createAsyncThunk(
  'adminDashboard/fetchMetrics',
  async () => {
    const result = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/dashboard/metrics`);
    return result?.data?.data;
  }
);

const adminDashboardSlice = createSlice({
  name: 'adminDashboard',
  initialState: {
    metrics: {
      totalProducts: 0,
      totalProductsSold: 0,
      totalRevenue: 0,
    },
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardMetrics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.metrics = action.payload;
        state.loading = false;
      })
      .addCase(fetchDashboardMetrics.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default adminDashboardSlice.reducer;
