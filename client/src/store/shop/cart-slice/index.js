import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


const generateGuestId = () => {
  return 'guest_' + Math.random().toString(36).substring(2, 18);
};

const getGuestId = () => {
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = generateGuestId();
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
};

const initialState = {
  cartItems: [],
  isLoading: false,
  error: null,
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const guestId = !userId ? getGuestId() : null; 
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/add`,
        {
          userId,
          guestId,  
          productId,
          quantity,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, { rejectWithValue }) => {
    try {
      const guestId = !userId ? getGuestId() : null;
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/get/${userId || guestId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const guestId = !userId ? getGuestId() : null;
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/${userId || guestId}/${productId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const guestId = !userId ? getGuestId() : null;
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/shop/cart/update-cart`,
        {
          userId,
          guestId,  
          productId,
          quantity,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default shoppingCartSlice.reducer;
