import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  paymentURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
  totalOrders: 0,
  totalPages: 1,
  currentPage: 1,
};

export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/order/create`,
      orderData 
    );

    return response.data;
  }
);

export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ reference, orderId, paymentMethod }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/shop/order/capture`,
      {
        reference, 
        orderId,
        paymentMethod, 
      }
    );

    return response.data;
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async ({ userId, page, limit }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/order/list/${userId}?page=${page}&limit=${limit}`
    );

    return response.data;
  }
);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/shop/order/details/${id}`
    );

    return response.data;
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentURL = action.payload.paymentURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.paymentURL = null;
        state.orderId = null;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
        state.totalOrders = action.payload.totalOrders;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
