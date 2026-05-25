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
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [banner, setBanner] = useState(null);

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
    
    const fetchBanner = async () => {
      try {
        const res = await api.get('/banners/active');
        setBanner(res.data.banner);
      } catch (error) {
        console.error('Failed to fetch banner');
      }
    };
    
    fetchAll();
    fetchBanner();
  }, []);

  const getSmartButtonLink = (banner) => {
    if (!banner) return '/products';
    
    // Use backend-generated smart link if available
    return banner.smartLink || banner.buttonLink || '/products';
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterLoading(true);
    setNewsletterMessage('');

    try {
      const res = await api.post('/newsletter/subscribe', { email: newsletterEmail });
      setNewsletterMessage(res.data.message);
      setNewsletterEmail('');
    } catch (error) {
      setNewsletterMessage(error.response?.data?.message || 'Failed to subscribe. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };

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
            Premium streetwear for everyone. Men's jeans & shirts, girls' fashion, and women's accessories.
          </p>
          <p className="text-zinc-300 text-lg mb-8 max-w-md">
            Find your perfect fit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/products" className="btn-primary bg-white text-black hover:bg-zinc-100 text-center px-8 py-4 text-lg font-semibold">
              Shop Now
            </Link>
            <Link to="/products?featured=true" className="btn-outline border-2 border-white text-white hover:bg-white hover:text-black text-center px-8 py-4 text-lg font-semibold">
              Featured
            </Link>
          </div>
        </div>
      </section>

      {/* Discount Banner */}
      {banner && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
          <div className={`bg-gradient-to-r ${banner.backgroundColor} rounded-xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4`}>
            <div>
              <p className={`${banner.textColor} text-2xl md:text-3xl font-bold`} dangerouslySetInnerHTML={{ __html: banner.title }} />
              {banner.subtitle && (
                <p className="text-zinc-400 text-sm mt-1">{banner.subtitle}</p>
              )}
            </div>
            <Link to={getSmartButtonLink(banner)} className="bg-white text-zinc-900 font-semibold px-6 py-3 text-sm tracking-wider uppercase hover:bg-zinc-100 transition-colors whitespace-nowrap">
              {banner.buttonText}
            </Link>
          </div>
        </section>
      )}

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

      {/* Newsletter Section */}
      <section className="bg-zinc-100 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-3">Stay Updated</h2>
          <p className="text-zinc-600 mb-6">Get exclusive deals, new arrivals, and style tips delivered to your inbox.</p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 px-4 py-3 border border-zinc-300 focus:outline-none focus:border-zinc-900"
              required
              disabled={newsletterLoading}
            />
            <button 
              type="submit" 
              disabled={newsletterLoading}
              className="bg-zinc-900 text-white px-8 py-3 font-semibold hover:bg-zinc-700 transition-colors whitespace-nowrap disabled:bg-zinc-400"
            >
              {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {newsletterMessage && (
            <p className={`text-sm mt-3 ${newsletterMessage.includes('success') || newsletterMessage.includes('Successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {newsletterMessage}
            </p>
          )}
          <p className="text-xs text-zinc-500 mt-3">
            We respect your privacy.{' '}
            <Link to="/unsubscribe" className="underline hover:text-zinc-700">
              Unsubscribe anytime
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: 'Rahul S.', rating: 5, text: 'Best quality jeans I\'ve ever bought! Perfect fit and amazing fabric.' },
            { name: 'Priya M.', rating: 5, text: 'Love the kurti collection! Fast delivery and great customer service.' },
            { name: 'Ankit K.', rating: 5, text: 'The accessories are stunning! My wife absolutely loves them.' },
          ].map((review, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md border border-zinc-200">
              <div className="flex gap-1 mb-3">
                {[...Array(review.rating)].map((_, j) => (
                  <span key={j} className="text-yellow-400">★</span>
                ))}
              </div>
              <p className="text-zinc-700 mb-4 italic">"{review.text}"</p>
              <p className="font-semibold text-sm">— {review.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
