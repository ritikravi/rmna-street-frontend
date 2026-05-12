const STORAGE_KEY = 'rmna_recently_viewed';
const MAX_ITEMS = 8;

export const addToRecentlyViewed = (product) => {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    // Remove if already exists
    const filtered = existing.filter(p => p._id !== product._id);
    
    // Add to beginning
    const updated = [
      {
        _id: product._id,
        name: product.name,
        price: product.price,
        discountPrice: product.discountPrice,
        images: product.images,
        category: product.category,
        fitType: product.fitType,
      },
      ...filtered
    ].slice(0, MAX_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save recently viewed:', err);
  }
};

export const getRecentlyViewed = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (err) {
    return [];
  }
};

export const clearRecentlyViewed = () => {
  localStorage.removeItem(STORAGE_KEY);
};
