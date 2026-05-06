import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import Logo from '../components/common/Logo';

export default function HomePage() {
  const dispatch = useDispatch();
  const { items: featured, loading } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts({ featured: true, limit: 8 }));
  }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] bg-zinc-900 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/30 z-10" />
        <img
          src="https://images.unsplash.com/photo-1542272604-787c3835535d?w=1600&q=80"
          alt="RMNA Street Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6">
          <Logo variant="light" size="xl" showTagline className="mb-8" />
          <h2 className="text-3xl md:text-5xl text-white font-bold leading-tight mb-6 tracking-wide">
            Street Style<br />
            <span style={{ color: '#BB0000' }}>Redefined.</span>
          </h2>
          <p className="text-zinc-300 text-lg mb-8 max-w-md">
            Premium men's jeans crafted for the streets. Find your perfect fit.
          </p>
          <div className="flex gap-4">
            <Link to="/products" className="btn-primary bg-white text-black hover:bg-zinc-100">
              Shop Now
            </Link>
            <Link to="/products?featured=true" className="btn-outline border-white text-white hover:bg-white hover:text-black">
              Featured
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Men's Jeans */}
          <Link to="/products" className="relative group overflow-hidden aspect-[4/3] bg-zinc-100">
            <img src="https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80" alt="Men's Jeans"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 flex items-end p-5">
              <div>
                <p className="text-zinc-300 text-xs uppercase tracking-widest mb-1">Men</p>
                <h3 className="font-display text-white text-xl font-bold">Jeans</h3>
              </div>
            </div>
          </Link>
          {/* Girls Jeans */}
          <Link to="/girls-jeans" className="relative group overflow-hidden aspect-[4/3] bg-zinc-100">
            <img src="https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&q=80" alt="Girls Jeans"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 flex items-end p-5">
              <div>
                <p className="text-zinc-300 text-xs uppercase tracking-widest mb-1">Girls</p>
                <h3 className="font-display text-white text-xl font-bold">Jeans</h3>
              </div>
            </div>
          </Link>
          {/* Girls Kurti */}
          <Link to="/girls-kurti" className="relative group overflow-hidden aspect-[4/3] bg-zinc-100">
            <img src="https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80" alt="Girls Kurti"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 flex items-end p-5">
              <div>
                <p className="text-zinc-300 text-xs uppercase tracking-widest mb-1">Girls</p>
                <h3 className="font-display text-white text-xl font-bold">Kurti</h3>
              </div>
            </div>
          </Link>
          {/* Jewellery - All Accessories */}
          <Link to="/women-accessories" className="relative group overflow-hidden aspect-[4/3] bg-zinc-100">
            <img src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80" alt="Jewellery"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 flex items-end p-5">
              <div>
                <p className="text-zinc-300 text-xs uppercase tracking-widest mb-1">Women</p>
                <h3 className="font-display text-white text-xl font-bold">Jewellery</h3>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold">Featured Drops</h2>
          <Link to="/products" className="text-sm tracking-wider uppercase underline hover:text-accent">
            View All
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-zinc-200 aspect-[3/4]" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 bg-zinc-200 rounded w-1/2" />
                  <div className="h-4 bg-zinc-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* USP Banner */}
      <section className="bg-zinc-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { icon: '🚚', title: 'Free Shipping', desc: 'On all orders' },
            { icon: '⚡', title: '48hr Delivery', desc: 'Fast & reliable' },
            { icon: '🔒', title: 'Secure Payment', desc: 'COD & Online available' },
            { icon: '✨', title: 'Premium Quality', desc: 'Crafted to last' },
          ].map((item) => (
            <div key={item.title}>
              <div className="text-3xl mb-2">{item.icon}</div>
              <h3 className="font-semibold text-sm tracking-wider uppercase">{item.title}</h3>
              <p className="text-zinc-400 text-xs mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
