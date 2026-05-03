import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

// ── Guest cart helpers (localStorage) ──────────────────────
const GUEST_KEY = 'rmna_guest_cart';
const loadGuest = () => JSON.parse(localStorage.getItem(GUEST_KEY) || '[]');
const saveGuest = (items) => localStorage.setItem(GUEST_KEY, JSON.stringify(items));
const clearGuest = () => localStorage.removeItem(GUEST_KEY);

// ── Thunks ──────────────────────────────────────────────────
export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/cart');
    return res.data.cart;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const addToCart = createAsyncThunk('cart/add', async (data, { getState, rejectWithValue }) => {
  const { token } = getState().auth;
  if (!token) return null; // handled locally in component
  try {
    const res = await api.post('/cart', data);
    return res.data.cart;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }, { getState, rejectWithValue }) => {
  const { token } = getState().auth;
  if (!token) return null;
  try {
    const res = await api.put(`/cart/${itemId}`, { quantity });
    return res.data.cart;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId, { getState, rejectWithValue }) => {
  const { token } = getState().auth;
  if (!token) return null;
  try {
    await api.delete(`/cart/${itemId}`);
    return itemId;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { getState, rejectWithValue }) => {
  const { token } = getState().auth;
  if (!token) return null;
  try { await api.delete('/cart'); } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

// Merge guest cart into DB cart after login
export const mergeGuestCart = createAsyncThunk('cart/merge', async (_, { rejectWithValue }) => {
  const guestItems = loadGuest();
  if (!guestItems.length) {
    const res = await api.get('/cart');
    return res.data.cart;
  }
  try {
    for (const item of guestItems) {
      await api.post('/cart', { productId: item.productId, size: item.size, quantity: item.quantity })
        .catch(() => {}); // skip if out of stock
    }
    clearGuest();
    const res = await api.get('/cart');
    return res.data.cart;
  } catch (e) { return rejectWithValue(e.response?.data?.message); }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],          // logged-in DB cart
    guestItems: loadGuest(), // guest localStorage cart
    loading: false,
    error: null,
  },
  reducers: {
    // Guest cart actions (no login needed)
    addGuestItem(state, action) {
      const { productId, size, quantity = 1, product } = action.payload;
      const existing = state.guestItems.find((i) => i.productId === productId && i.size === size);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.guestItems.push({ productId, size, quantity, product });
      }
      saveGuest(state.guestItems);
    },
    updateGuestItem(state, action) {
      const { productId, size, quantity } = action.payload;
      if (quantity <= 0) {
        state.guestItems = state.guestItems.filter((i) => !(i.productId === productId && i.size === size));
      } else {
        const item = state.guestItems.find((i) => i.productId === productId && i.size === size);
        if (item) item.quantity = quantity;
      }
      saveGuest(state.guestItems);
    },
    removeGuestItem(state, action) {
      const { productId, size } = action.payload;
      state.guestItems = state.guestItems.filter((i) => !(i.productId === productId && i.size === size));
      saveGuest(state.guestItems);
    },
    clearGuestCart(state) {
      state.guestItems = [];
      clearGuest();
    },
  },
  extraReducers: (builder) => {
    const setCart = (s, a) => { s.loading = false; if (a.payload) s.items = a.payload?.items || []; };
    builder
      .addCase(fetchCart.pending, (s) => { s.loading = true; })
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(addToCart.fulfilled, setCart)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(removeFromCart.fulfilled, (s, a) => {
        if (a.payload) s.items = s.items.filter((i) => i._id !== a.payload);
      })
      .addCase(clearCart.fulfilled, (s) => { s.items = []; })
      .addCase(mergeGuestCart.fulfilled, (s, a) => {
        s.loading = false;
        if (a.payload) { s.items = a.payload?.items || []; s.guestItems = []; }
      });
  },
});

export const { addGuestItem, updateGuestItem, removeGuestItem, clearGuestCart } = cartSlice.actions;
export default cartSlice.reducer;
