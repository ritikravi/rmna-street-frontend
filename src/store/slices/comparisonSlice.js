import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'rmna_comparison';

// Load from localStorage
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save to localStorage
const saveToStorage = (selectedProducts) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProducts));
  } catch (error) {
    console.error('Failed to save comparison to localStorage:', error);
  }
};

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState: {
    selectedProducts: loadFromStorage(),
    products: {},
    isComparisonViewOpen: false,
  },
  reducers: {
    addToComparison: (state, action) => {
      const product = action.payload;
      if (state.selectedProducts.length >= 4) {
        return; // Max 4 products
      }
      if (!state.selectedProducts.includes(product._id)) {
        state.selectedProducts.push(product._id);
        state.products[product._id] = product;
        saveToStorage(state.selectedProducts);
      }
    },
    removeFromComparison: (state, action) => {
      const productId = action.payload;
      state.selectedProducts = state.selectedProducts.filter(id => id !== productId);
      delete state.products[productId];
      saveToStorage(state.selectedProducts);
    },
    toggleComparisonView: (state) => {
      state.isComparisonViewOpen = !state.isComparisonViewOpen;
    },
    openComparisonView: (state) => {
      state.isComparisonViewOpen = true;
    },
    closeComparisonView: (state) => {
      state.isComparisonViewOpen = false;
    },
    clearComparison: (state) => {
      state.selectedProducts = [];
      state.products = {};
      state.isComparisonViewOpen = false;
      saveToStorage([]);
    },
    loadProductData: (state, action) => {
      const product = action.payload;
      if (state.selectedProducts.includes(product._id)) {
        state.products[product._id] = product;
      }
    },
  },
});

export const {
  addToComparison,
  removeFromComparison,
  toggleComparisonView,
  openComparisonView,
  closeComparisonView,
  clearComparison,
  loadProductData,
} = comparisonSlice.actions;

// Selectors
export const selectComparisonProducts = (state) => 
  state.comparison.selectedProducts.map(id => state.comparison.products[id]).filter(Boolean);

export const selectIsInComparison = (productId) => (state) =>
  state.comparison.selectedProducts.includes(productId);

export const selectComparisonCount = (state) => state.comparison.selectedProducts.length;

export const selectCanAddMore = (state) => state.comparison.selectedProducts.length < 4;

// Detect differences between products
export const selectDifferences = (state) => {
  const products = selectComparisonProducts(state);
  if (products.length < 2) return {};

  const fields = ['price', 'discountPrice', 'color', 'brand', 'fitType', 'rating'];
  const differences = {};

  fields.forEach(field => {
    const values = products.map(p => JSON.stringify(p[field]));
    const uniqueValues = new Set(values);
    differences[field] = uniqueValues.size > 1;
  });

  // Check sizes difference
  const sizeArrays = products.map(p => JSON.stringify(p.sizes?.map(s => s.size).sort()));
  differences.sizes = new Set(sizeArrays).size > 1;

  return differences;
};

export default comparisonSlice.reducer;
