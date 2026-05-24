import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';
import Logo from '../components/common/Logo';
import api from '../utils/api';

const CATEGORY_SECTIONS = [
  { key: 'jeans',             label: "Men's Jeans",   link: '/products?category=jeans' },
  { key: 'mens-shirts',       label: "Men's Shirts",  link: '/mens-shirts' },
  { key: 'girls-jeans',       label: 'Girls Jeans',   link: '/girls-jeans' },
  { key: 'girls-kurti',       label: 'Girls Kurti',   link: '/girls-kurti' },
  { key: 'women-accessories', label: 'Jewellery',     link: '/women-accessories' },
];

export default function HomePage() {
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const results = {};
      await Promise.all(
        CATEGORY_SECTIONS.map(async ({ key }) => {
          try {
            const res = await api.get('/products', { params: { category: key, featured: 'true', limit: 4 } });
            if (res.data.products.length > 0) results[key] = res.data.products;
          } catch {}
        })
      );
      setCategoryProducts(results);
      setLoading(false);
    };
    fetchAll();
  }, []);

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
            Premium men's jeans, girls' fashion, and women's accessories crafted for the streets.
          </p>
          <p className="text-zinc-300 text-lg mb-8 max-w-md">
            Find your perfect fit.
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

      {/* Discount Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-700 rounded-xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white text-2xl md:text-3xl font-bold">Upto <span className="text-red-400">50% OFF</span> on selected styles</p>
            <p className="text-zinc-400 text-sm mt-1">Limited time offer · Free shipping on all orders</p>
          </div>
          <Link to="/products?discounted=true" className="bg-white text-zinc-900 font-semibold px-6 py-3 text-sm tracking-wider uppercase hover:bg-zinc-100 transition-colors whitespace-nowrap">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Shop by Category — circular icons like Meesho */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-display text-2xl font-bold mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-5 md:grid-cols-5 gap-6">
          {/* Men's Jeans */}
          <Link to="/products?category=jeans" className="flex flex-col items-center gap-3 group">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-zinc-200 group-hover:border-zinc-900 transition-colors">
              <img src="https://res.cloudinary.com/dymvnrcyl/image/upload/v1778064505/pexels-tien-nguyen-1378177-18533668_siuzdz.jpg" alt="Men's Jeans"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-sm font-medium text-center">Men's Jeans</span>
          </Link>
          {/* Men's Shirts */}
          <Link to="/mens-shirts" className="flex flex-col items-center gap-3 group">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-zinc-200 group-hover:border-zinc-900 transition-colors">
              <img src="https://res.cloudinary.com/dymvnrcyl/image/upload/v1778066087/mens_shirt_acxqdx.jpg" alt="Men's Shirts"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-sm font-medium text-center">Men's Shirts</span>
          </Link>
          {/* Girls Jeans */}
          <Link to="/girls-jeans" className="flex flex-col items-center gap-3 group">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-zinc-200 group-hover:border-zinc-900 transition-colors">
              <img src="https://res.cloudinary.com/dymvnrcyl/image/upload/v1778063917/jeans_icon_pjk3j9.jpg" alt="Girls Jeans"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-sm font-medium text-center">Girls Jeans</span>
          </Link>
          {/* Girls Kurti */}
          <Link to="/girls-kurti" className="flex flex-col items-center gap-3 group">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-zinc-200 group-hover:border-zinc-900 transition-colors">
              <img src="https://res.cloudinary.com/dymvnrcyl/image/upload/v1778063723/kurti_ety3mk.jpg" alt="Girls Kurti"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-sm font-medium text-center">Girls Kurti</span>
          </Link>
          {/* Jewellery */}
          <Link to="/women-accessories" className="flex flex-col items-center gap-3 group">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-zinc-200 group-hover:border-zinc-900 transition-colors">
              <img src="https://res.cloudinary.com/dymvnrcyl/image/upload/v1778064102/jewellery_kbryrp.jpg" alt="Jewellery"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            </div>
            <span className="text-sm font-medium text-center">Jewellery</span>
          </Link>
        </div>
      </section>

      {/* Featured by Category */}
      {loading ? (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
          <div className="h-8 bg-zinc-200 rounded w-48 mb-6 animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-zinc-200 aspect-[3/4]" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 bg-zinc-200 rounded w-1/2" />
                  <div className="h-4 bg-zinc-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        CATEGORY_SECTIONS.map(({ key, label, link }) =>
          categoryProducts[key] ? (
            <section key={key} className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold">{label}</h2>
                <Link to={link} className="text-sm tracking-wider uppercase underline hover:text-accent">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {categoryProducts[key].map((p) => <ProductCard key={p._id} product={p} />)}
              </div>
            </section>
          ) : null
        )
      )}

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
