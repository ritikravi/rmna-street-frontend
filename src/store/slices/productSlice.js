import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchProducts = createAsyncThunk('products/fetch', async (params, { rejectWithValue }) => {
  try {
    const res = await api.get('/products', { params });
    return res.data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message);
  }
});

export const fetchProduct = createAsyncThunk('products/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/products/${id}`);
    return res.data.product;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: { items: [], product: null, loading: false, error: null, total: 0, pages: 1, page: 1 },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.products;
        s.total = a.payload.total;
        s.pages = a.payload.pages;
        s.page = a.payload.page;
      })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchProduct.pending, (s) => { s.loading = true; s.product = null; })
      .addCase(fetchProduct.fulfilled, (s, a) => { s.loading = false; s.product = a.payload; })
      .addCase(fetchProduct.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export default productSlice.reducer;
