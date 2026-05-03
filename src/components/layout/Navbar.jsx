import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingBag, FiHeart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';
import Logo from '../common/Logo';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useSelector((s) => s.auth);
  const { items, guestItems } = useSelector((s) => s.cart);
  const { token } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const allItems = token ? items : guestItems;
  const cartCount = allItems.reduce((acc, i) => acc + i.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo variant="dark" size="md" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/products" className="text-sm font-medium tracking-wider uppercase hover:text-accent transition-colors">
              Shop
            </Link>
            <Link to="/products?fitType=straight" className="text-sm font-medium tracking-wider uppercase hover:text-accent transition-colors">
              Straight Fit
            </Link>
            <Link to="/products?fitType=baggy" className="text-sm font-medium tracking-wider uppercase hover:text-accent transition-colors">
              Baggy Fit
            </Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-1 hover:text-accent transition-colors">
              <FiSearch size={20} />
            </button>

            <Link to="/wishlist" className="p-1 hover:text-accent transition-colors">
              <FiHeart size={20} />
            </Link>

            <Link to="/cart" className="p-1 hover:text-accent transition-colors relative">
              <FiShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="p-1 hover:text-accent transition-colors">
                  <FiUser size={20} />
                </button>
                <div className="absolute right-0 top-8 w-48 bg-white border border-zinc-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-zinc-50">Profile</Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-zinc-50">My Orders</Link>
                  <button
                    onClick={() => { dispatch(logout()); navigate('/'); }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="p-1 hover:text-accent transition-colors">
                <FiUser size={20} />
              </Link>
            )}

            <button className="md:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <form onSubmit={handleSearch} className="pb-3">
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jeans, fits..."
              className="w-full border-b border-zinc-300 py-2 text-sm focus:outline-none focus:border-zinc-900"
            />
          </form>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-3">
            <Link to="/products" onClick={() => setMenuOpen(false)} className="text-sm font-medium tracking-wider uppercase">Shop All</Link>
            <Link to="/products?fitType=straight" onClick={() => setMenuOpen(false)} className="text-sm font-medium tracking-wider uppercase">Straight Fit</Link>
            <Link to="/products?fitType=baggy" onClick={() => setMenuOpen(false)} className="text-sm font-medium tracking-wider uppercase">Baggy Fit</Link>
            {user && <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-sm font-medium tracking-wider uppercase">My Orders</Link>}
          </nav>
        )}
      </div>
    </header>
  );
}
