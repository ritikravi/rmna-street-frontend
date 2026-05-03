import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/wishlist');
    return res.data.wishlist;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message);
  }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (productId, { rejectWithValue }) => {
  try {
    const res = await api.post('/wishlist/toggle', { productId });
    return res.data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { products: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (s, a) => { s.products = a.payload?.products || []; })
      .addCase(toggleWishlist.fulfilled, (s, a) => {
        s.products = a.payload.wishlist?.products || [];
      });
  },
});

export default wishlistSlice.reducer;
