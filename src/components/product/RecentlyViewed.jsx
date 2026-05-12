import { useState, useEffect } from 'react';
import { getRecentlyViewed } from '../../utils/recentlyViewed';
import ProductCard from './ProductCard';

export default function RecentlyViewed() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(getRecentlyViewed());
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <h2 className="font-display text-2xl font-bold mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
